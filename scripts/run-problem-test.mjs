#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fg from 'fast-glob';

const slug = process.argv[2];
if (!slug || !/^[a-zA-Z0-9_-]+$/.test(slug)) {
  console.error('Usage: yarn test:problem <exact-directory-name>');
  process.exit(1);
}
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const matches = await fg(`docs/{DSA,dsa}/**/${slug}/**/*.test.{ts,js,mjs}`, {
  cwd: root,
  absolute: true,
});
// DSA and dsa resolve to the same directory on a case-insensitive filesystem.
const seen = new Set();
const tests = matches.filter((file) => {
  const { dev, ino } = fs.statSync(file);
  const identity = `${dev}:${ino}`;
  if (seen.has(identity)) return false;
  seen.add(identity);
  return true;
});
if (!tests.length) {
  console.error(`No tests found for ${slug}. Directory names are case-sensitive.`);
  process.exit(1);
}
if (tests.some((file) => !/from\s+['"]node:test['"]/.test(fs.readFileSync(file, 'utf8')))) {
  console.error(
    'This example still has legacy Jest-style tests or placeholder assertions. Convert them to node:test and node:assert/strict before running. See README.md for validation commands.',
  );
  process.exit(1);
}
const result = spawnSync(process.execPath, ['--test', ...tests], { cwd: root, stdio: 'inherit' });
if (result.error) console.error(result.error.message);
process.exit(result.status ?? 1);
