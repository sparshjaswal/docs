#!/usr/bin/env node
import {spawnSync} from 'node:child_process';

const slug = process.argv[2];
if (!slug) {
  console.error('Usage: npm run test:problem <slug>');
  process.exit(1);
}

const pattern = `docs/dsa/**/${slug}/**/*.test.@(ts|js)`;
const result = spawnSync('npx', ['jest', '--', pattern], { stdio: 'inherit' });
process.exit(result.status ?? 1);
