import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import http from 'node:http';
import { createApplication } from '../src/server.mjs';
import { copy } from '../src/domain.mjs';
import { fixture, simulatedOutput, temporary } from './helpers.mjs';

async function launch(t,runtime,options={}){
  let calls=0;
  const modelService={apiKey:null,budget:{status:async()=>({model:'SIMULATED',attempts:calls})},analyze:async()=>{calls++;return {output:options.output??simulatedOutput(),attempt:'simulated',origin:'simulated_controls',usage:null,costUsd:null};}};
  const app=await createApplication({runtime,modelService,writer:options.writer}),base=await app.listen(0);t.after(()=>app.close());
  const token=(await (await fetch(base+'/api/session')).json()).token;
  async function request(route,data,headers={}){
    const r=await fetch(base+'/api/'+route,data===undefined?{}:{method:'POST',headers:{'Content-Type':'application/json',Origin:base,'X-Review-Token':token,...headers},body:JSON.stringify(data)});
    return {status:r.status,value:await r.json()};
  }
  return {app,base,request,calls:()=>calls};
}
test('HTTP flow: analysis writes no case state; rejects pending; saves only approvals; idempotence and restart',async t=>{
  const runtime=await temporary(t),{app,request}=await launch(t,runtime);
  const initial=(await request('run',{})).value;
  const analyzed=await request('analyze',{runId:initial.run.id,baseStorageRevision:initial.storageRevision,source:fixture.novelty});
  assert.equal(analyzed.status,200);assert.deepEqual((await request('run')).value.run,initial.run);
  const d=analyzed.value.draft;
  const command={draftId:d.id,baseStorageRevision:initial.storageRevision,actionId:randomUUID(),mode:'finalize',confirmCompleted:true,decisions:[]};
  assert.equal((await request('commit',command)).status,400);
  assert.deepEqual((await request('run')).value.run,initial.run);
  command.decisions=d.proposals.map((p,i)=>({proposalId:p.id,status:i===2?'rejected':'accepted'}));
  const saved=await request('commit',command);assert.equal(saved.status,200);
  assert.equal(saved.value.run.caseData.current_fiber_mbps,300);assert.deepEqual(saved.value.run.caseData.offer_interest,[]);
  assert.deepEqual((await request('commit',command)).value.run,saved.value.run);
  const changed=copy(command);changed.decisions[2].status='accepted';assert.equal((await request('commit',changed)).status,409);
  await app.close();
  const restarted=await launch(t,runtime);assert.deepEqual((await restarted.request('run')).value.run,saved.value.run);
  assert.equal((await restarted.request('commit',command)).status,200);
});
test('partial HTTP save updates only its own draft, survives restart and finalizes earlier receipts',async t=>{
  const runtime=await temporary(t),service=await launch(t,runtime);
  const initial=(await service.request('run',{})).value;
  const payload={runId:initial.run.id,baseStorageRevision:initial.storageRevision,source:fixture.novelty};
  const draft=(await service.request('analyze',payload)).value.draft,other=(await service.request('analyze',payload)).value.draft;
  const command={draftId:draft.id,baseStorageRevision:initial.storageRevision,actionId:randomUUID(),mode:'partial',confirmCompleted:false,decisions:[{proposalId:draft.proposals[0].id,status:'accepted'}]};
  const partial=await service.request('commit',command);assert.equal(partial.status,200);assert.equal(partial.value.run.reviewEvents.length,0);assert.equal(partial.value.openReviews.length,1);
  assert.equal(partial.value.draft.baseStorageRevision,partial.value.storageRevision);assert.equal(partial.value.draft.savedProposalIds.length,1);
  assert.deepEqual((await service.request('commit',command)).value.run,partial.value.run);
  const stale={...command,actionId:randomUUID(),draftId:other.id,decisions:[{proposalId:other.proposals[0].id,status:'accepted'}]};assert.equal((await service.request('commit',stale)).status,409);
  await service.app.close();const fresh=await launch(t,runtime);const reopened=(await fresh.request('run')).value;
  assert.deepEqual(reopened.run,partial.value.run);assert.equal(reopened.openReviews.length,1);
  const missing={...command,actionId:randomUUID(),baseStorageRevision:reopened.storageRevision};assert.equal((await fresh.request('commit',missing)).status,409);
  const continued=(await fresh.request('analyze',{...payload,baseStorageRevision:reopened.storageRevision})).value.draft;
  assert.equal(continued.savedProposalIds.length,1);
  const final={draftId:continued.id,actionId:randomUUID(),baseStorageRevision:continued.baseStorageRevision,mode:'finalize',confirmCompleted:true,decisions:continued.proposals.map(p=>({proposalId:p.id,status:continued.savedProposalIds.includes(p.id)?'saved':'rejected'}))};
  const done=await fresh.request('commit',final);assert.equal(done.status,200);assert.equal(done.value.run.dataVersion,2);assert.equal(done.value.run.reviewEvents[0].acceptedCount,1);assert.equal(done.value.openReviews.length,0);
});
test('confirmed unchanged source reopens without model calls or duplicated history; metadata cannot change',async t=>{
  const output={...simulatedOutput(),proposals:[],no_change_reason:'Simulación de control, sin propuestas'};
  const service=await launch(t,await temporary(t),{output}),initial=(await service.request('run',{})).value;
  let d=(await service.request('analyze',{runId:initial.run.id,baseStorageRevision:initial.storageRevision,source:fixture.novelty})).value.draft;
  assert.equal((await service.request('run')).value.run.reviewEvents.length,0);
  let command={draftId:d.id,baseStorageRevision:d.baseStorageRevision,actionId:randomUUID(),mode:'finalize',confirmCompleted:true,decisions:[]};
  const saved=(await service.request('commit',command)).value;
  const repeat=await service.request('analyze',{runId:initial.run.id,baseStorageRevision:saved.storageRevision,source:fixture.novelty});d=repeat.value.draft;
  assert.equal(d.origin,'existing_review');assert.equal(d.interpretation,null);assert.equal(service.calls(),1);
  command={...command,draftId:d.id,baseStorageRevision:d.baseStorageRevision,actionId:randomUUID()};
  const repeated=(await service.request('commit',command)).value;assert.equal(repeated.duplicateReview,true);assert.deepEqual(repeated.run,saved.run);
  assert.equal((await service.request('analyze',{runId:initial.run.id,baseStorageRevision:repeated.storageRevision,source:{...fixture.novelty,author:'Otro'}})).status,400);
});
test('replaying an older partial after finalization cannot revive the consumed draft or roll its base back',async t=>{
  const service=await launch(t,await temporary(t)),initial=(await service.request('run',{})).value;
  const d=(await service.request('analyze',{runId:initial.run.id,baseStorageRevision:initial.storageRevision,source:fixture.novelty})).value.draft;
  const partial={draftId:d.id,actionId:randomUUID(),baseStorageRevision:d.baseStorageRevision,mode:'partial',confirmCompleted:false,decisions:[{proposalId:d.proposals[0].id,status:'accepted'}]};
  const saved=(await service.request('commit',partial)).value;
  const final={...partial,actionId:randomUUID(),baseStorageRevision:saved.storageRevision,mode:'finalize',confirmCompleted:true,decisions:d.proposals.map((p,i)=>({proposalId:p.id,status:i===0?'saved':'rejected'}))};
  const done=(await service.request('commit',final)).value,repeated=(await service.request('commit',partial)).value;
  assert.deepEqual(repeated.run,done.run);assert.equal(repeated.draft,null);
  assert.equal(service.app.drafts.get(d.id).consumed,true);assert.equal(service.app.drafts.get(d.id).baseStorageRevision,done.storageRevision);
});
test('origin and token are required, external host rejected, key absent from health',async t=>{
  const {request,base}=await launch(t,await temporary(t));
  assert.equal((await request('run',{}, {Origin:'http://example.com'})).status,403);
  assert.equal((await request('run',{}, {'X-Review-Token':'wrong'})).status,403);
  const externalHostStatus=await new Promise((resolve,reject)=>{
    const req=http.get(base+'/api/health',{headers:{Host:'external.example'}},res=>{res.resume();resolve(res.statusCode);});req.on('error',reject);
  });
  assert.equal(externalHostStatus,403);
  const health=(await request('health')).value;assert.equal(health.modelAvailable,false);assert.equal(JSON.stringify(health).includes('OPENAI_API_KEY'),false);
  const page=await fetch(base);assert.match(page.headers.get('content-security-policy'),/default-src 'self'/);
});
