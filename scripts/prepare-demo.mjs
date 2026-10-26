// Package an existing, disclosed real response for a no-key review. Never generate or reset data/usage.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {getFixture} from '../src/fixtures.mjs';
import {newRun,hash,validateSource,validateOutput,requireThat} from '../src/domain.mjs';
import {buildPayload} from '../src/model.mjs';
import {readJson,atomicWrite} from '../src/store.mjs';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
export async function prepareDemo(runtime=path.join(root,'runtime')){
  const evidence=JSON.parse(await fs.readFile(path.join(root,'devpost/evidence-pending-actions.json'),'utf8'));
  const e=evidence.cases.R47,f=getFixture('R47'),run=newRun(f),source=validateSource(f.novelty);
  requireThat(e.requestFingerprint===hash(buildPayload(run,source)),'Recorded R47 does not match the current instructions/context');
  validateOutput(e.originalOutput,[...run.sources,source],run.caseData);
  const file=path.join(runtime,'recorded-responses.json'),entries=await readJson(file,{});
  const entry={attempt:e.attempt,requestFingerprint:e.requestFingerprint,output:e.originalOutput,evidence:'devpost/evidence-pending-actions.json'};
  if(entries.R47){
    requireThat(entries.R47.requestFingerprint===entry.requestFingerprint&&hash(entries.R47.output)===hash(entry.output),'A different R47 record already exists; it has not been overwritten');
    return 'Compatible recorded response already present; nothing changed.';
  }
  await atomicWrite(file,{...entries,R47:entry});
  return 'Recorded R47 response prepared. No API call. Workspace and inference ledger untouched.';
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
  prepareDemo().then(console.log).catch(error=>{console.error(error.message);process.exitCode=1;});
}
