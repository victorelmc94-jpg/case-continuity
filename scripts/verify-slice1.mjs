// Explicit local evidence check. This script NEVER invokes the model.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { hash, validateOutput } from '../src/domain.mjs';
import { atomicWrite } from '../src/store.mjs';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url))),runtime=path.join(root,'runtime');
const read=async p=>JSON.parse(await fs.readFile(path.join(runtime,p),'utf8'));
const workspace=await read('workspace.json'),run=workspace.runs[workspace.activeRunId];
const ledger=await read('inference-ledger.json');
const file=path.join(runtime,'evaluation','slice1-checkpoint.json');
const phase=process.argv[2];
if(phase==='before-save'){
  assert.equal(run.dataVersion,1);assert.equal(run.caseData.current_fiber_mbps,600);
  assert.equal(run.incorporationReceipts.length,0);assert.equal(run.reviewEvents.length,0);
  const attempt=ledger.attempts.at(-1),evidence=await read('evaluation/'+attempt.id+'.json');
  const output=JSON.parse(evidence.raw.output.filter(i=>i.type==='message').flatMap(i=>i.content??[]).filter(c=>c.type==='output_text').map(c=>c.text).join(''));
  validateOutput(output,[...run.sources,evidence.novelty],run.caseData);
  assert.equal(output.interpretation.authorization,'explicitly_not_authorized');
  assert.equal(output.proposals.find(p=>p.kind==='fiber_correction')?.value.number,300);
  const conditional=output.proposals.find(p=>p.kind==='conditional_budget');assert.equal(conditional?.value.number,50);
  const conditions=conditional.conditions.join(' ');assert.match(conditions,/dos líneas/i);assert.match(conditions,/doce meses/i);
  assert.equal(output.proposals.some(p=>p.target==='budget_reference'),false);
  const interest=output.proposals.find(p=>p.kind==='offer_interest');assert.equal(interest?.value.offer_id,'A');assert.match(interest.value.text,/no contrates/i);
  console.log(JSON.stringify({phase,result:'PASS',attempt:attempt.id,runId:run.id,model:evidence.raw.model,rawOutputHash:hash(output),dataVersion:1,receipts:0,reviews:0,proposals:output.proposals.length,interpretation:output.interpretation,conditions},null,2));
}else if(phase==='checkpoint'){
  const d=run.caseData;
  assert.equal(d.current_fiber_mbps,300);assert.equal(d.budget_reference,40);
  assert.equal(d.budget_conditions.length,1);assert.equal(d.budget_conditions[0].amount,50);assert.equal(d.budget_conditions[0].conditions.length,2);
  assert.equal(d.offer_interest.length,1);assert.match(d.offer_interest[0].declaration,/no contrates/i);
  assert.equal(d.contract_authorization,'Sin autorización registrada');assert.equal(d.antecedents.length,0);
  assert.equal(d.uncertainties.length,1);assert.equal(d.next_movement,'Aclarar las condiciones de la oferta A');
  assert.equal(run.dataVersion,2);assert.equal(run.incorporationReceipts.length,4);assert.equal(run.reviewEvents.length,1);
  assert.equal(run.reviewEvents[0].rejectedCount,1);assert.equal(run.sources.length,3);
  const health=await (await fetch('http://127.0.0.1:4317/api/health')).json();
  await atomicWrite(file,{run,runHash:hash(run),storageRevision:workspace.storageRevision,attempts:ledger.attempts.length,pid:health.pid,at:new Date().toISOString()});
  console.log(JSON.stringify({phase,result:'PASS',runHash:hash(run),dataVersion:run.dataVersion,receipts:4,reviews:1,pid:health.pid},null,2));
}else if(phase==='recovery'){
  const checkpoint=JSON.parse(await fs.readFile(file,'utf8'));
  const response=await (await fetch('http://127.0.0.1:4317/api/run')).json();
  const health=await (await fetch('http://127.0.0.1:4317/api/health')).json();
  assert.notEqual(health.pid,checkpoint.pid,'Expected an actual new server process');
  assert.deepEqual(run,checkpoint.run);assert.deepEqual(response.run,checkpoint.run);
  assert.equal(workspace.storageRevision,checkpoint.storageRevision);assert.equal(ledger.attempts.length,checkpoint.attempts);
  const result={phase,result:'PASS',runHash:hash(run),previousPid:checkpoint.pid,currentPid:health.pid,attemptsUnchanged:ledger.attempts.length,at:new Date().toISOString()};
  await atomicWrite(path.join(runtime,'evaluation','slice1-recovery.json'),result);console.log(JSON.stringify(result,null,2));
}else throw Error('Use before-save, checkpoint or recovery. No inference is performed.');
