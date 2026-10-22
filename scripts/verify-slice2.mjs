// Explicit one-call C6 evaluation or a separate recovery check. Never retries.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {createApplication} from '../src/server.mjs';
import {Budget,ModelService} from '../src/model.mjs';
import {atomicWrite} from '../src/store.mjs';
import {hash} from '../src/domain.mjs';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url))),runtime=path.join(root,'runtime','slice2-c6');
const evidenceFile=path.join(runtime,'checkpoint.json'),budget=new Budget(path.join(root,'runtime','inference-ledger.json'));
const phase=process.argv[2];
assert.ok(['generate-c6','recovery'].includes(phase),'Choose generate-c6 (one inference) or recovery (zero inference)');
const model=new ModelService({runtime,apiKey:process.env.OPENAI_API_KEY,budget});
const app=await createApplication({runtime,modelService:model});
const base=await app.listen(4320),token=(await (await fetch(base+'/api/session')).json()).token;
const request=async(route,data)=>{
  const res=await fetch(base+'/api/'+route,data===undefined?{}:{method:'POST',headers:{Origin:base,'Content-Type':'application/json','X-Review-Token':token},body:JSON.stringify(data)});
  const value=await res.json();assert.ok(res.ok,value.error??'Local request failed');return value;
};
try{
  if(phase==='generate-c6'){
    await assert.rejects(fs.access(evidenceFile),'C6 already evaluated: do not repeat implicitly');
    const before=await budget.status();assert.equal(before.ratesValid,true);assert.ok(before.remainingAttempts>0);
    const source=JSON.parse(await fs.readFile(path.join(root,'fixtures/no-news.json'),'utf8'));
    const initial=await request('run',{}),result=await request('analyze',{runId:initial.run.id,baseStorageRevision:initial.storageRevision,source});
    const untouched=await request('run');assert.deepEqual(untouched.run,initial.run);
    await atomicWrite(path.join(runtime,'model-verdict.json'),{at:new Date().toISOString(),attempt:result.draft.attempt,original:result.draft,MODEL:result.draft.proposals.length===0?'PASS':'FAIL',scope:'C6 only, not six-case global'});
    assert.equal(result.draft.proposals.length,0,'C6 model proposed an unnecessary change; inspect evidence before continuing');
    const command={draftId:result.draft.id,baseStorageRevision:result.draft.baseStorageRevision,actionId:crypto.randomUUID(),mode:'finalize',confirmCompleted:true,decisions:[]};
    const saved=await request('commit',command);assert.equal(saved.run.dataVersion,1);assert.equal(saved.run.reviewEvents.length,1);assert.deepEqual(saved.run.caseData,initial.run.caseData);
    const repeat=await request('analyze',{runId:saved.run.id,baseStorageRevision:saved.storageRevision,source});assert.equal(repeat.draft.origin,'existing_review');
    const again=await request('commit',{...command,draftId:repeat.draft.id,baseStorageRevision:repeat.draft.baseStorageRevision,actionId:crypto.randomUUID()});
    assert.deepEqual(again.run,saved.run);assert.equal(again.duplicateReview,true);
    const after=await budget.status();assert.equal(after.attempts,before.attempts+1);
    const checkpoint={run:again.run,runHash:hash(again.run),pid:process.pid,attempts:after.attempts,at:new Date().toISOString(),attempt:result.draft.attempt,MODEL:'PASS',GUARDS:'PASS',RECOVERY:'NOT RUN'};
    await atomicWrite(evidenceFile,checkpoint);console.log(JSON.stringify({phase,MODEL:'PASS',GUARDS:'PASS',attempt:checkpoint.attempt,budget:after,runHash:checkpoint.runHash},null,2));
  }else{
    const checkpoint=JSON.parse(await fs.readFile(evidenceFile,'utf8')),view=await request('run');
    assert.notEqual(process.pid,checkpoint.pid);assert.deepEqual(view.run,checkpoint.run);assert.equal((await budget.status()).attempts,checkpoint.attempts);
    const evidence={phase,RECOVERY:'PASS',previousPid:checkpoint.pid,currentPid:process.pid,runHash:hash(view.run),attempts:checkpoint.attempts,at:new Date().toISOString()};
    await atomicWrite(path.join(runtime,'recovery.json'),evidence);console.log(JSON.stringify(evidence,null,2));
  }
}finally{await app.close();}
