import test from 'node:test';
import assert from 'node:assert/strict';
import { copy, finalize, validateOutput, validateProposal } from '../src/domain.mjs';
import { scenario, simulatedOutput } from './helpers.mjs';

test('legitimate approved corrections persist with conditional budget, provenance and one version',()=>{
  const {workspace,draft,command,run}=scenario();
  const next=finalize(workspace,draft,command),saved=next.runs[run.id];
  assert.equal(saved.caseData.current_fiber_mbps,300);
  assert.equal(saved.caseData.budget_reference,40);
  assert.equal(saved.caseData.budget_conditions[0].amount,50);
  assert.equal(saved.caseData.budget_conditions[0].conditions.length,2);
  assert.equal(saved.caseData.contract_authorization,'Sin autorización registrada');
  assert.equal(saved.caseData.next_movement,run.caseData.next_movement);
  assert.equal(saved.caseData.offer_interest[0].offer_id,'A');
  assert.equal(saved.dataVersion,2);assert.equal(saved.incorporationReceipts.length,3);
  assert.equal(saved.sources.at(-1).text,draft.novelty.text);
  assert.equal(saved.reviewEvents.length,1);assert.equal(run.dataVersion,1);
});
test('pending, absent completion, duplicated decisions and stale revisions cannot save',()=>{
  const {workspace,draft,command}=scenario();
  for(const change of [c=>c.decisions.pop(),c=>c.confirmCompleted=false,c=>c.decisions[1]=copy(c.decisions[0]),c=>c.baseStorageRevision=0,c=>c.decisions[0].status='pending']){
    const c=copy(command);change(c);assert.throws(()=>finalize(workspace,draft,c));
  }
  assert.equal(workspace.runs[draft.runId].reviewEvents.length,0);
});
test('rejected changes do not alter fields and all rejected does not create a data version',()=>{
  const {workspace,draft,command}=scenario();command.decisions[0].status='rejected';
  const saved=finalize(workspace,draft,command).runs[draft.runId];
  assert.equal(saved.caseData.current_fiber_mbps,600);assert.equal(saved.caseData.budget_conditions[0].amount,50);
  command.decisions.forEach(d=>d.status='rejected');
  const none=finalize(workspace,draft,command).runs[draft.runId];
  assert.deepEqual(none.caseData,workspace.runs[draft.runId].caseData);assert.equal(none.dataVersion,1);
  assert.equal(none.reviewEvents[0].conclusion,'Revisado, sin cambios');
});
test('human edits need explicit acceptance, retain source, and cannot change target',()=>{
  const {workspace,draft,command}=scenario();
  const p=draft.proposals[0];command.decisions[0]={proposalId:p.id,status:'accepted_edited',edit:{summary:'Corrección revisada',value:{...p.value,number:350},conditions:[]}};
  const saved=finalize(workspace,draft,command).runs[draft.runId];
  assert.equal(saved.caseData.current_fiber_mbps,350);assert.equal(saved.incorporationReceipts[0].humanEdited,true);
  assert.deepEqual(saved.incorporationReceipts[0].proposal.source_refs,p.source_refs);
  command.decisions[0].edit.target='contract_authorization';assert.throws(()=>finalize(workspace,draft,command));
});
test('fabricated source, unsupported authorization and empty conditional budget are rejected',()=>{
  const {draft,run}=scenario();
  const p=copy(draft.proposals[0]);delete p.id;p.target='contract_authorization';assert.throws(()=>validateProposal(p,draft.sources,run.caseData));
  const out=simulatedOutput();out.proposals[0].source_refs[0].quote='Una cita inventada';assert.throws(()=>validateOutput(out,draft.sources,run.caseData));
  const conditional=copy(draft.proposals[1]);delete conditional.id;conditional.conditions=[];assert.throws(()=>validateProposal(conditional,draft.sources,run.caseData));
  const interest=copy(draft.proposals[2]);delete interest.id;interest.value.text=null;assert.throws(()=>validateProposal(interest,draft.sources,run.caseData),/Interés sin/);
});
test('reference budget and follow-up fields can legitimately change after approval (simulated controls)',()=>{
  for(const [target,number,text] of [['budget_reference',45,null],['next_movement',null,'Esperar respuesta del cliente'],['operational_state',null,'A la espera del cliente']]){
    const {workspace,draft,command}=scenario();
    draft.proposals=[{...draft.proposals[0],kind:'case_update',target,value:{number,text,document_source_id:null,offer_id:null,offer:null}}];
    command.decisions=command.decisions.slice(0,1);
    assert.equal(finalize(workspace,draft,command).runs[draft.runId].caseData[target],number??text);
  }
});
