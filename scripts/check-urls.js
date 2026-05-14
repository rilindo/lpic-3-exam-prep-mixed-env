#!/usr/bin/env node
/**
 * Audit every "reference" URL in the question bank.
 * Usage: node scripts/check-urls.js
 * Exit code 0 = all live, 1 = broken URLs found.
 */
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fs = { readFileSync, readdirSync };
const path = { join };

const questionsDir = path.join(__dirname, '..', 'src', 'data', 'questions');

const files = fs.readdirSync(questionsDir)
  .filter((f) => f.endsWith('.json'))
  .sort();

/** @type {Map<string, string[]>} url -> list of "file:id" owners */
const references = new Map();

for (const file of files) {
  const fullPath = path.join(questionsDir, file);
  let items;
  try {
    items = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  } catch (err) {
    console.error(`JSON parse error in ${file}: ${err.message}`);
    process.exit(1);
  }
  for (const item of items) {
    if (!item.reference) continue;
    if (!references.has(item.reference)) references.set(item.reference, []);
    references.get(item.reference).push(`${file}:${item.id}`);
  }
}

(async () => {
  const broken = [];

  for (const [url, owners] of references.entries()) {
    try {
      const res = await fetch(url, { redirect: 'follow' });
      if (!res.ok) {
        broken.push({ url, status: res.status, finalUrl: res.url, owners });
      }
    } catch (err) {
      broken.push({ url, error: String(err), owners });
    }
  }

  console.log(`Checked: ${references.size}`);
  if (broken.length === 0) {
    console.log('All references are live.');
    process.exit(0);
  }

  console.error(`\nBroken (${broken.length}):`);
  for (const entry of broken) {
    const detail = entry.status ? `HTTP ${entry.status}` : entry.error;
    console.error(`  [${detail}] ${entry.url}`);
    for (const owner of entry.owners) {
      console.error(`    -> ${owner}`);
    }
  }
  process.exit(1);
})();
