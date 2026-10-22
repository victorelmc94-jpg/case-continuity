// Local UI verification of original recorded fictitious responses. No inference method is available.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createApplication} from '../src/server.mjs';
import {Budget} from '../src/model.mjs';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url))),runtime=path.join(root,'runtime','ui-slice3');
await fs.mkdir(runtime,{recursive:true});
await fs.copyFile(path.join(root,'runtime','recorded-responses.json'),path.join(runtime,'recorded-responses.json'));
const budget=new Budget(path.join(root,'runtime','inference-ledger.json'));
const app=await createApplication({runtime,modelService:{budget,analyze:async()=>{throw Error('No inference in UI verification');}}});
console.log('UI verification only: '+await app.listen(4318));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,async()=>{await app.close();process.exit(0);});
