#!/usr/bin/env node
import path from 'node:path';
import { NodeFileStore } from '../src/file-store/node';
import { getScenes } from '../src';

const main = async () => {
  try {
    const result = await getScenes({ vfs: new NodeFileStore(), root: path.resolve(__dirname) });
    const schema = result.toModel();
    console.log(JSON.stringify(schema, null, 2));
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

main().catch(console.error);
