import test from 'node:test';
import assert from 'node:assert/strict';
import {budgetStatement,describeValue,contractingInstruction} from '../public/presentation.mjs';
import {scenario} from './helpers.mjs';

test('conditional willingness stays conditional, in plain language',()=>{
  const item={amount:50,declaration:'Podría estudiar hasta 50 euros si incluye las dos líneas y el precio no sube durante doce meses',conditions:['Incluye las dos líneas','No sube durante doce meses']};
  assert.equal(budgetStatement(item),'Podría estudiar hasta 50 €/mes si incluye las dos líneas y el precio no sube durante doce meses');
  const text=describeValue('budget_conditions',[item]);assert.match(text,/Podría estudiar/);assert.match(text,/Condiciones:/);assert.equal(text.includes('{'),false);
  assert.equal(describeValue('current_fiber_mbps',600),'600 Mb');assert.equal(describeValue('budget_reference',40),'40 €/mes');
});
test('contracting instruction requires an incorporated statement with supporting quotation',()=>{
  const {run,draft}=scenario();run.sources=draft.sources;
  assert.equal(contractingInstruction(run),null);
  run.caseData.offer_interest.push({declaration:'Me interesa, pero no contrates todavía.',source_refs:[{source_id:'S-DEMO',quote:'La oferta A me interesa, pero no contrates todavía.'}]});
  assert.equal(contractingInstruction(run).text,'El cliente pide no contratar todavía');
  run.caseData.offer_interest[0].source_refs[0].quote='Texto sin respaldo';assert.equal(contractingInstruction(run),null);
});
