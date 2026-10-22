import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { randomUUID } from 'node:crypto';
import { AppError, copy, hash, requireThat, newRun, validateSource, validateOutput, commitReview, bundleKey, effectKey, openReviews, sameConditions } from './domain.mjs';
import { WorkspaceStore } from './store.mjs';
import { ModelService } from './model.mjs';
import {getFixture,caseList} from './fixtures.mjs';
import {recordedResponse} from './recorded.mjs';

const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
export async function createApplication({runtime=path.join(root,'runtime'),modelService,writer}={}) {
  const store=new WorkspaceStore(path.join(runtime,'workspace.json'),writer);
  const model=modelService??new ModelService({runtime,apiKey:process.env.OPENAI_API_KEY});
  const token=randomUUID();
  const drafts=new Map();
  let origin;
  async function view(workspace) {
    workspace ??= await store.read();
    const run=workspace.runs[workspace.activeRunId]??null,fixture=getFixture(run?.fixtureId??'MAIN');
    return {storageRevision:workspace.storageRevision,run,novelty:fixture.novelty,documents:fixture.documents,cases:caseList,
      openReviews:run?openReviews(run):[],budget:await model.budget.status(),slice:3};
  }
  async function body(req) {
    requireThat(req.headers['content-type']?.split(';')[0]==='application/json','La petición debe ser JSON',415);
    const chunks=[];
    let size=0;
    for await (const chunk of req) {
      size+=chunk.length;
      requireThat(size<=32768,'La petición supera el límite local',413);
      chunks.push(chunk);
    }
    const raw=Buffer.concat(chunks).toString('utf8');
    try{return JSON.parse(raw);}catch{throw new AppError('JSON no válido');}
  }
  const server=http.createServer(async(req,res)=>{
    const send=(status,value)=>{
      res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
      res.end(JSON.stringify(value));
    };
    try {
      requireThat(req.headers.host===new URL(origin).host,'Host no permitido',403);
      const url=new URL(req.url,origin);
      if(req.method==='GET' && url.pathname==='/api/session') return send(200,{token});
      if(req.method==='GET' && url.pathname==='/api/health') return send(200,{app:'build-ai-basics-candidate',slice:3,pid:process.pid,modelAvailable:Boolean(model.apiKey),storage:'local'});
      if(req.method==='GET' && url.pathname==='/api/run') return send(200,await view());
      if(req.method==='POST') {
        requireThat(req.headers.origin===origin && req.headers['x-review-token']===token,'Solicitud de revisión no autorizada',403);
        const data=await body(req);
        if(url.pathname==='/api/run') {
          requireThat(Object.keys(data).every(k=>k==='fixtureId'),'Creación de caso no válida');
          const fixture=getFixture(data.fixtureId??'MAIN');requireThat(fixture,'Prueba ficticia desconocida');
          const workspace=await store.transact(current=>{
            const run=newRun(fixture);
            current.runs[run.id]=run;current.activeRunId=run.id;current.storageRevision++;
            return current;
          });
          return send(201,await view(workspace));
        }
        if(['/api/analyze','/api/recorded'].includes(url.pathname)) {
          requireThat(Object.keys(data).every(k=>['runId','baseStorageRevision','source','documents'].includes(k)),'Análisis no válido');
          const workspace=await store.read();
          requireThat(data.runId===workspace.activeRunId && data.baseStorageRevision===workspace.storageRevision,'La prueba ha cambiado; recarga antes de analizar',409);
          const run=workspace.runs[data.runId];
          requireThat(run,'Primero inicia una prueba ficticia');
          const novelty=validateSource(data.source);
          requireThat(['human_note','offer'].includes(novelty.type),'La novedad debe ser una nota o una oferta');
          requireThat(data.documents===undefined||(Array.isArray(data.documents)&&data.documents.length<=1),'Se admite un texto documental separado');
          const documents=(data.documents??[]).map(validateSource);
          requireThat(documents.every(s=>s.type==='document'&&s.id!==novelty.id),'Documento separado no válido');
          const existing=run.sources.find(s=>s.id===novelty.id);
          requireThat(!existing || ['id','type','author','sourceDate','text'].every(k=>existing[k]===novelty[k]),'Una fuente conservada no se cambia. Usa una referencia nueva para una fuente distinta');
          const sources=existing?copy(run.sources):[...copy(run.sources),novelty];
          for(const document of documents){const previous=sources.find(s=>s.id===document.id);
            requireThat(!previous||['id','type','author','sourceDate','text'].every(k=>previous[k]===document[k]),'Una fuente documental conservada no se sustituye');
            if(!previous)sources.push(document);}
          const key=bundleKey(novelty,documents);
          const prior=run.reviewEvents.filter(e=>
            (e.reviewKey===key||(!e.reviewKey&&!documents.length&&existing&&e.sourceIds.includes(novelty.id)))&&
            (e.dataVersion??run.dataVersions.find(v=>v.at===e.at)?.version)===run.dataVersion).at(-1);
          // Reopening an unchanged, completed review is deterministic and never poses as new model understanding.
          const result=prior?{output:{interpretation:null,proposals:[],no_change_reason:'La misma fuente ya tiene una revisión confirmada y los datos no han cambiado. No se ha consultado el modelo.'},origin:'existing_review'}:
            url.pathname==='/api/recorded'?await recordedResponse(runtime,run,novelty,documents):await model.analyze(run,novelty,documents);
          const valid=prior?result.output:validateOutput(result.output,sources,run.caseData);
          const draft={id:randomUUID(),runId:run.id,baseStorageRevision:workspace.storageRevision,novelty,documents,reviewKey:key,sources,
            interpretation:valid.interpretation,proposals:valid.proposals.map(p=>({...p,id:randomUUID()})),
            no_change_reason:valid.no_change_reason,attempt:result.attempt??null,origin:result.origin??'model',consumed:false,savedProposalIds:[]};
          draft.savedProposalIds=draft.proposals.filter(p=>run.incorporationReceipts.some(r=>r.effectKey===effectKey(p,novelty,key)&&(p.kind!=='conditional_budget'||sameConditions(r.proposal.conditions,p.conditions)))).map(p=>p.id);
          drafts.set(draft.id,draft);
          // Cap ephemeral drafts; this never turns a draft into an incorporated fact.
          if(drafts.size>20) drafts.delete(drafts.keys().next().value);
          return send(200,{draft,usage:result.usage,costUsd:result.costUsd,budget:await model.budget.status()});
        }
        if(url.pathname==='/api/commit') {
          requireThat(['partial','finalize'].includes(data.mode),'Modo de guardado no válido');
          const workspace=await store.transact(current=>{
            const applied=current.actions[data.actionId];
            if(applied) {
              requireThat(applied.commandHash===hash(data),'El identificador ya se usó para otro guardado',409);
              return null;
            }
            const draft=drafts.get(data.draftId);
            requireThat(draft,'El borrador no existe o se perdió al reiniciar; nada se ha incorporado.',409);
            return commitReview(current,draft,data);
          });
          const draft=drafts.get(data.draftId);
          const applied=workspace.actions[data.actionId];
          if(draft){
            if((applied.storageRevision??draft.baseStorageRevision)>=draft.baseStorageRevision){
              draft.consumed=data.mode==='finalize';
              draft.baseStorageRevision=applied.storageRevision??draft.baseStorageRevision;
            }
            draft.savedProposalIds=[...new Set([...(draft.savedProposalIds??[]),...(applied.savedProposalIds??[])])];
          }
          return send(200,{...await view(workspace),draft:data.mode==='partial'&&!draft?.consumed?draft:null,duplicateReview:applied.duplicateReview??false});
        }
        throw new AppError('Ruta no disponible',404);
      }
      if(req.method==='GET') {
        const files={'/':'index.html','/app.js':'app.js','/presentation.mjs':'presentation.mjs','/styles.css':'styles.css'};
        const file=files[url.pathname];
        requireThat(file,'Ruta no disponible',404);
        const content=await fs.readFile(path.join(root,'public',file));
        const mime=file.endsWith('.html')?'text/html':/\.m?js$/.test(file)?'text/javascript':'text/css';
        res.writeHead(200,{'Content-Type':mime+'; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff',
          'Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'"});
        res.end(content);return;
      }
      throw new AppError('Método no permitido',405);
    } catch(error) {
      if(!res.headersSent) send(error instanceof AppError ? error.status : 500,{error:error instanceof AppError ? error.message : 'No se pudo completar la operación local. No se ha confirmado el guardado.'});
      else res.end();
    }
  });
  server.requestTimeout=90000;
  server.headersTimeout=10000;
  return {server,store,model,drafts,async listen(port=4317){
    origin='http://127.0.0.1:'+port;
    await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',resolve);});
    origin='http://127.0.0.1:'+server.address().port;
    return origin;
  },async close(){server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}};
}

async function main() {
  const runtime=path.join(root,'runtime');
  await fs.mkdir(runtime,{recursive:true});
  const lockFile=path.join(runtime,'server.lock');
  let lock;
  try {lock=await fs.open(lockFile,'wx');}
  catch(error) {
    if(error.code!=='EEXIST') throw error;
    const previous=JSON.parse(await fs.readFile(lockFile,'utf8'));
    let alive=true;try{process.kill(previous.pid,0);}catch(e){if(e.code==='ESRCH') alive=false;else throw e;}
    if(alive) throw new Error('Ya hay un proceso local usando esta carpeta. No se ha iniciado otro.');
    await fs.unlink(lockFile);
    lock=await fs.open(lockFile,'wx');
  }
  await lock.writeFile(JSON.stringify({pid:process.pid,app:'build-ai-basics-candidate'}));
  await lock.close();
  let app;
  const release=async()=>{await fs.unlink(lockFile).catch(()=>{});};
  try {
    app=await createApplication();
    const address=await app.listen(4317);
    console.log('Aplicación local lista: '+address);
    for(const signal of ['SIGINT','SIGTERM']) process.on(signal,async()=>{await app.close();await release();process.exit(0);});
  } catch(error) {await release();throw error;}
}
if(process.argv[1] && import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch(error=>{console.error(error instanceof AppError?error.message:'No se pudo iniciar el servidor local: '+error.message);process.exitCode=1;});
}
