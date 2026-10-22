import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { AppError, copy, requireThat } from './domain.mjs';

export async function atomicWrite(file, data) {
  await fs.mkdir(path.dirname(file),{recursive:true});
  const temporary = file + '.' + randomUUID() + '.tmp';
  let handle;
  try {
    handle = await fs.open(temporary,'wx');
    await handle.writeFile(JSON.stringify(data,null,2),'utf8');
    await handle.sync();
    await handle.close(); handle = null;
    await fs.rename(temporary,file);
  } catch (error) {
    if(handle) await handle.close().catch(()=>{});
    await fs.unlink(temporary).catch(()=>{});
    throw error;
  }
}
export async function readJson(file, initial) {
  try { return JSON.parse(await fs.readFile(file,'utf8')); }
  catch(error) { if(error.code === 'ENOENT') return copy(initial); throw new AppError('No se pudo leer el archivo local. No se ha reinicializado.',500); }
}
export class WorkspaceStore {
  constructor(file, writer = atomicWrite) { this.file=file; this.writer=writer; this.tail=Promise.resolve(); }
  async read() {
    const value = await readJson(this.file,{schemaVersion:1,storageRevision:0,activeRunId:null,runs:{},actions:{}});
    requireThat(value.schemaVersion === 1 && Number.isInteger(value.storageRevision) && value.runs && value.actions,'Archivo local incompatible',500);
    return value;
  }
  transact(mutator) {
    const task = this.tail.then(async()=>{
      const current=await this.read();
      const next=await mutator(copy(current));
      if(next) await this.writer(this.file,next);
      return this.read();
    });
    this.tail=task.catch(()=>{});
    return task;
  }
}
