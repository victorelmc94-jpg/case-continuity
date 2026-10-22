// Run only for the participant's explicit 12 -> 40 extension. No network, no inference.
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {Budget} from '../src/model.mjs';
import {hash} from '../src/domain.mjs';
import {atomicWrite,readJson} from '../src/store.mjs';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url))),runtime=path.join(root,'runtime');
const budget=new Budget(path.join(runtime,'inference-ledger.json')),before=await budget.read();
if(before.authorization.maxAttempts!==40){
  assert.equal(await readJson(path.join(runtime,'server.lock'),null),null,'Stop the local server before extending authorization');
  await budget.extendFinalTestAuthorization();
}
const after=await budget.read();
assert.deepEqual(after.attempts,before.attempts);assert.equal(after.blocked,before.blocked);assert.equal(after.authorization.budgetUsd,1);assert.equal(after.authorization.maxAttempts,40);
if(before.authorization.maxAttempts!==after.authorization.maxAttempts)await atomicWrite(path.join(runtime,'evaluation','authorization-extension.json'),{at:new Date().toISOString(),previousAuthorization:before.authorization,currentAuthorization:after.authorization,
  attemptsRetained:after.attempts.length,attemptsHash:hash(after.attempts),blockedRetained:after.blocked,networkCalls:0});
console.log(JSON.stringify(await budget.status(),null,2));
