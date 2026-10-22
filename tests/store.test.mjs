import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs/promises';
import { WorkspaceStore, atomicWrite } from '../src/store.mjs';
import { temporary } from './helpers.mjs';

test('serialized writes survive a fresh store instance',async t=>{
  const file=path.join(await temporary(t),'workspace.json'),store=new WorkspaceStore(file);
  await Promise.all(Array.from({length:8},()=>store.transact(w=>{w.storageRevision++;return w;})));
  assert.equal((await new WorkspaceStore(file).read()).storageRevision,8);
});
test('failed disk write leaves previous committed data intact',async t=>{
  const file=path.join(await temporary(t),'workspace.json'),store=new WorkspaceStore(file);
  await store.transact(w=>{w.storageRevision=1;return w;});
  const failing=new WorkspaceStore(file,async()=>{throw Error('injected disk error');});
  await assert.rejects(failing.transact(w=>{w.storageRevision=2;return w;}));
  assert.equal((await store.read()).storageRevision,1);
});
test('corrupt local JSON is reported and never silently reset',async t=>{
  const file=path.join(await temporary(t),'workspace.json');await fs.writeFile(file,'broken');
  await assert.rejects(new WorkspaceStore(file).read(),/No se pudo leer/);
  assert.equal(await fs.readFile(file,'utf8'),'broken');
});
test('atomic file replacement is readable and leaves no temporary files',async t=>{
  const dir=await temporary(t),file=path.join(dir,'one.json');
  await atomicWrite(file,{value:1});await atomicWrite(file,{value:2});
  assert.deepEqual(JSON.parse(await fs.readFile(file)),{value:2});assert.deepEqual(await fs.readdir(dir),['one.json']);
});
