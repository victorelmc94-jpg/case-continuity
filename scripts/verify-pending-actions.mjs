// Three explicit, bounded model regressions. No automatic retries or production case edits.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {randomUUID} from 'node:crypto';
import {Budget,ModelService,buildPayload} from '../src/model.mjs';
import {getFixture} from '../src/fixtures.mjs';
import {newRun,validateSource,validateOutput,hash} from '../src/domain.mjs';
import {atomicWrite,readJson,WorkspaceStore} from '../src/store.mjs';
import {createApplication} from '../src/server.mjs';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url))),production=path.join(root,'runtime'),runtime=path.join(production,'pending-actions');
const budget=new Budget(path.join(production,'inference-ledger.json'));
const [phase,id]=process.argv.slice(2);
function regressionFixture(id){
  const fixture=getFixture('R47');
  if(id==='PARALLEL')fixture.novelty={...fixture.novelty,id:'S-PARALELA-FACTURA',text:'La factura te la enviaré mañana. Aún no tengo una decisión sobre la oferta.'};
  else if(id==='REPLACE')fixture.novelty={...fixture.novelty,id:'S-CANCELACION-EXPRESA',text:'Cancela la tarea de aclarar las condiciones de la oferta A: he descartado esa oferta. El próximo movimiento será esperar a que yo te envíe otra propuesta. No me llames ni contrates nada.'};
  else assert.equal(id,'R47');
  return fixture;
}
if(phase==='generate'){
  assert.ok(['R47','PARALLEL','REPLACE'].includes(id));
  const lock=await readJson(path.join(production,'server.lock'),null);
  if(lock){let alive=true;try{process.kill(lock.pid,0);}catch(e){if(e.code==='ESRCH')alive=false;else throw e;}
    assert.equal(alive,false,'Stop the production service before using its budget from a separate process');}
  await fs.mkdir(runtime,{recursive:true});const marker=await fs.open(path.join(runtime,id+'.started'),'wx');await marker.close();
  const f=regressionFixture(id),run=newRun(f),novelty=validateSource(f.novelty),before=await budget.status();
  assert.ok(before.ratesValid&&before.remainingAttempts>0);
  const original=await readJson(path.join(root,'devpost/evidence-s-prueba-47-original.json'));
  assert.deepEqual(run.caseData,original.run.dataVersions[0].caseData);
  const model=new ModelService({runtime,apiKey:process.env.OPENAI_API_KEY,budget});
  const lockPath=path.join(runtime,'generation.lock'),generationLock=await fs.open(lockPath,'wx');
  try{
    const result=await model.analyze(run,novelty),output=result.output;
    let contract='PASS',contractError=null;try{validateOutput(output,[...run.sources,novelty],run.caseData);}catch(e){contract='FAIL';contractError=e.message;}
    const evidence={id,at:new Date().toISOString(),attempt:result.attempt,requestFingerprint:hash(buildPayload(run,novelty)),output,contract,contractError,
      usage:result.usage,MODEL:'PENDING_SEMANTIC_REVIEW',purpose:'Agent regression; not a participant test'};
    await atomicWrite(path.join(runtime,id+'.json'),evidence);console.log(JSON.stringify(evidence,null,2));
  }catch(e){await atomicWrite(path.join(runtime,id+'.json'),{id,MODEL:'FAIL',error:e.message});console.error(e.message);process.exitCode=1;}
  finally{await generationLock.close();await fs.unlink(lockPath);}
  console.log(JSON.stringify({budget:await budget.status()}));
}else if(phase==='register'){
  // Only the new response is added. Prior recorded outputs retain their old fingerprints and identity.
  const e=await readJson(path.join(runtime,'R47.json'));assert.equal(e.contract,'PASS');
  const entry={attempt:e.attempt,requestFingerprint:e.requestFingerprint,output:e.output,evidence:'runtime/pending-actions/R47.json'};
  for(const folder of [production,runtime]){const file=path.join(folder,'recorded-responses.json'),entries=await readJson(file,{});entries.R47=entry;await atomicWrite(file,entries);}
  console.log('Corrected R47 registered explicitly, no inference.');
}else if(phase==='positive-control'){
  const f=regressionFixture('REPLACE'),e=await readJson(path.join(runtime,'REPLACE.json')),before=await budget.status();
  const isolated=path.join(runtime,'positive-control');
  const app=await createApplication({runtime:isolated,modelService:{budget,analyze:async()=>({output:e.output,attempt:e.attempt,origin:'recorded_model'})}});
  const base=await app.listen(4321),token=(await(await fetch(base+'/api/session')).json()).token;
  const request=async(route,body)=>{const r=await fetch(base+'/api/'+route,body===undefined?{}:{method:'POST',headers:{Origin:base,'Content-Type':'application/json','X-Review-Token':token},body:JSON.stringify(body)});const data=await r.json();assert.ok(r.ok,data.error);return data;};
  try{
    const initial=await request('run',{fixtureId:'R47'}),d=(await request('analyze',{runId:initial.run.id,baseStorageRevision:initial.storageRevision,source:f.novelty})).draft;
    assert.deepEqual((await request('run')).run,initial.run);
    const saved=await request('commit',{draftId:d.id,baseStorageRevision:d.baseStorageRevision,actionId:randomUUID(),mode:'finalize',confirmCompleted:true,decisions:d.proposals.map(p=>({proposalId:p.id,status:'accepted'}))});
    const proposal=e.output.proposals.find(p=>p.target==='next_movement');assert.ok(proposal);assert.equal(saved.run.caseData.next_movement,proposal.value.text);assert.notEqual(saved.run.caseData.next_movement,initial.run.caseData.next_movement);
    assert.deepEqual(await budget.status(),before);
    await atomicWrite(path.join(runtime,'positive-checkpoint.json'),{pid:process.pid,run:saved.run,runHash:hash(saved.run),GUARDS:'PASS',source:'Original captured response; no inference'});
    console.log('Explicit replacement accepted and saved with its sources; zero new inference.');
  }finally{await app.close();}
}else if(phase==='recovery'){
  const checkpoint=await readJson(path.join(runtime,'edit-checkpoint.json'));
  const health=await(await fetch('http://127.0.0.1:4318/api/health')).json(),view=await(await fetch('http://127.0.0.1:4318/api/run')).json();
  assert.notEqual(health.pid,checkpoint.pid);assert.deepEqual(view.run,checkpoint.run);assert.equal(hash(view.run),checkpoint.runHash);
  const original=await readJson(path.join(root,'devpost/evidence-s-prueba-47-original.json')),current=await readJson(path.join(production,'workspace.json'));
  assert.equal(hash(current.runs[original.run.id]),original.runHash,'Original human trial must remain unchanged');
  const positive=await readJson(path.join(runtime,'positive-checkpoint.json')),positiveStore=new WorkspaceStore(path.join(runtime,'positive-control','workspace.json'));
  const positiveWorkspace=await positiveStore.read();assert.notEqual(process.pid,positive.pid);assert.deepEqual(positiveWorkspace.runs[positive.run.id],positive.run);
  const result={RECOVERY:'PASS',at:new Date().toISOString(),previousPid:checkpoint.pid,currentPid:health.pid,runHash:hash(view.run),originalHumanRunUnchanged:true,positiveReplacementRecovered:true,budget:await budget.status()};
  await atomicWrite(path.join(runtime,'edit-recovery.json'),result);console.log(JSON.stringify(result,null,2));
}else throw Error('Choose generate R47|PARALLEL|REPLACE, register, positive-control, or recovery');
