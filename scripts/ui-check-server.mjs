// Isolated UI controls only, explicitly simulated; no API credential or inference.
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createApplication} from '../src/server.mjs';
import {simulatedOutput} from '../tests/helpers.mjs';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const modelService={apiKey:null,budget:{status:async()=>({model:'SIMULATED',attempts:0,reservedUsd:0,knownGenerationCostUsd:0,ratesValid:true})},
  analyze:async()=>({output:simulatedOutput(),origin:'simulated_controls',attempt:null})};
const app=await createApplication({runtime:path.join(root,'runtime','ui-controls'),modelService});
console.log('Simulated UI controls only: '+await app.listen(4318));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,async()=>{await app.close();process.exit(0);});
