import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import http from 'node:http';
import { createApplication } from '../src/server.mjs';
import { copy } from '../src/domain.mjs';
import { fixture, simulatedOutput, temporary } from './helpers.mjs';

async function launch(t,runtime){
  const modelService={apiKey:null,budget:{status:async()=>({model:'SIMULATED',attempts:0})},analyze:async()=>({output:simulatedOutput(),attempt:'simulated',usage:null,costUsd:null})};
  const app=await createApplication({runtime,modelService}),base=await app.listen(0);t.after(()=>app.close());
  const token=(await (await fetch(base+'/api/session')).json()).token;
  async function request(route,data,headers={}){
    const r=await fetch(base+'/api/'+route,data===undefined?{}:{method:'POST',headers:{'Content-Type':'application/json',Origin:base,'X-Review-Token':token,...headers},body:JSON.stringify(data)});
    return {status:r.status,value:await r.json()};
  }
  return {app,base,request};
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
