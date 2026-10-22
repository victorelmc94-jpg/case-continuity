// Repetition of the approved fictitious evaluation only. Never a silent model fallback.
import path from 'node:path';
import {readJson} from './store.mjs';
import {buildPayload} from './model.mjs';
import {copy,hash,requireThat} from './domain.mjs';
export async function recordedResponse(runtime,run,novelty,documents=[]){
  const entries=await readJson(path.join(runtime,'recorded-responses.json'),{});
  const entry=entries[run.fixtureId??'MAIN'];
  requireThat(entry&&entry.requestFingerprint===hash(buildPayload(run,novelty,documents)),
    'No hay respuesta registrada para este contexto exacto. Inicia una prueba ficticia nueva y conserva su entrada original.',409);
  return {output:copy(entry.output),attempt:entry.attempt,origin:'recorded_model'};
}
