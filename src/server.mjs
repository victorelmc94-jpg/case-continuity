import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { randomUUID } from 'node:crypto';
import { AppError, copy, hash, requireThat, newRun, validateSource, validateOutput, finalize } from './domain.mjs';
import { WorkspaceStore } from './store.mjs';
import { ModelService } from './model.mjs';

const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
export async function createApplication({runtime=path.join(root,'runtime'),modelService,writer}={}) {
  const fixture=JSON.parse(await fs.readFile(path.join(root,'fixtures/main.json'),'utf8'));
  const store=new WorkspaceStore(path.join(runtime,'workspace.json'),writer);
  const model=modelService??new ModelService({runtime,apiKey:process.env.OPENAI_API_KEY});
  const token=randomUUID();
  const drafts=new Map();
  let origin;
  async function view(workspace) {
    workspace ??= await store.read();
    return {storageRevision:workspace.storageRevision,run:workspace.runs[workspace.activeRunId]??null,novelty:fixture.novelty,
      budget:await model.budget.status(),slice:1};
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
      if(req.method==='GET' && url.pathname==='/api/health') return send(200,{app:'build-ai-basics-candidate',slice:1,pid:process.pid,modelAvailable:Boolean(model.apiKey),storage:'local'});
      if(req.method==='GET' && url.pathname==='/api/run') return send(200,await view());
      if(req.method==='POST') {
        requireThat(req.headers.origin===origin && req.headers['x-review-token']===token,'Solicitud de revisión no autorizada',403);
        const data=await body(req);
        if(url.pathname==='/api/run') {
          requireThat(Object.keys(data).length===0,'Creación de caso no válida');
          const workspace=await store.transact(current=>{
            const run=newRun(fixture);
            current.runs[run.id]=run;current.activeRunId=run.id;current.storageRevision++;
            return current;
          });
          return send(201,await view(workspace));
        }
        if(url.pathname==='/api/analyze') {
          requireThat(Object.keys(data).every(k=>['runId','baseStorageRevision','source'].includes(k)),'Análisis no válido');
          const workspace=await store.read();
          requireThat(data.runId===workspace.activeRunId && data.baseStorageRevision===workspace.storageRevision,'La prueba ha cambiado; recarga antes de analizar',409);
          const run=workspace.runs[data.runId];
          requireThat(run,'Primero inicia una prueba ficticia');
          const novelty=validateSource(data.source);
          const existing=run.sources.find(s=>s.id===novelty.id);
          requireThat(!existing || existing.contentHash===novelty.contentHash,'Usa una referencia nueva para una fuente distinta');
          requireThat(!run.reviewEvents.some(e=>e.sourceIds.includes(novelty.id)),'Esta fuente ya está revisada. En el corte 1 inicia otra prueba para repetirla.',409);
          const sources=existing?copy(run.sources):[...copy(run.sources),novelty];
          const result=await model.analyze(run,novelty);
          const valid=validateOutput(result.output,sources,run.caseData);
          const draft={id:randomUUID(),runId:run.id,baseStorageRevision:workspace.storageRevision,novelty,sources,
            interpretation:valid.interpretation,proposals:valid.proposals.map(p=>({...p,id:randomUUID()})),
            no_change_reason:valid.no_change_reason,attempt:result.attempt,consumed:false};
          drafts.set(draft.id,draft);
          // Cap ephemeral drafts; this never turns a draft into an incorporated fact.
          if(drafts.size>20) drafts.delete(drafts.keys().next().value);
          return send(200,{draft,usage:result.usage,costUsd:result.costUsd,budget:await model.budget.status()});
        }
        if(url.pathname==='/api/commit') {
          requireThat(data.mode==='finalize','El guardado parcial pertenece al corte 2; aún no está habilitado.',501);
          const workspace=await store.transact(current=>{
            const applied=current.actions[data.actionId];
            if(applied) {
              requireThat(applied.commandHash===hash(data),'El identificador ya se usó para otro guardado',409);
              return null;
            }
            const draft=drafts.get(data.draftId);
            requireThat(draft,'El borrador no existe o se perdió al reiniciar; nada se ha incorporado.',409);
            return finalize(current,draft,data);
          });
          const draft=drafts.get(data.draftId);
          if(draft) draft.consumed=true;
          return send(200,await view(workspace));
        }
        throw new AppError('Ruta no disponible',404);
      }
      if(req.method==='GET') {
        const files={'/':'index.html','/app.js':'app.js','/styles.css':'styles.css'};
        const file=files[url.pathname];
        requireThat(file,'Ruta no disponible',404);
        const content=await fs.readFile(path.join(root,'public',file));
        const mime=file.endsWith('.html')?'text/html':file.endsWith('.js')?'text/javascript':'text/css';
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
