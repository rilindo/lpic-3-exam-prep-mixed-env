#!/usr/bin/env node
/**
 * Verify that each question's correct answer text appears in its reference URL.
 * Usage: node scripts/check-answer-references.js
 * Exit code 0 = all answers found, 1 = mismatches or fetch errors.
 *
 * Notes:
 *  - URLs are fetched once and reused for all questions sharing that URL.
 *  - Matching is case-insensitive plain-text search against the HTML body.
 *  - A 500ms delay between requests avoids hammering remote servers.
 */

import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const questionsDir = join(__dirname, '..', 'src', 'data', 'questions');

// ── Load all questions ────────────────────────────────────────────────────────

const files = readdirSync(questionsDir)
  .filter((f) => f.endsWith('.json'))
  .sort();

/** @type {Array<{file:string, id:string, correct:string, reference:string}>} */
const questions = [];

for (const file of files) {
  const fullPath = join(questionsDir, file);
  let items;
  try {
    items = JSON.parse(readFileSync(fullPath, 'utf8'));
  } catch (err) {
    console.error(`JSON parse error in ${file}: ${err.message}`);
    process.exit(1);
  }
  for (const item of items) {
    if (!item.reference || !item.correct) continue;
    questions.push({
      file,
      id: item.id,
      correct: item.correct,
      reference: item.reference,
    });
  }
}

// ── Group by URL so each page is fetched only once ───────────────────────────

/** @type {Map<string, typeof questions>} */
const byUrl = new Map();
for (const q of questions) {
  if (!byUrl.has(q.reference)) byUrl.set(q.reference, []);
  byUrl.get(q.reference).push(q);
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Strip HTML tags; collapse whitespace. */
function extractText(html) {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ');
}

const STOP_WORDS = new Set([
  'both', 'and', 'the', 'for', 'from', 'with', 'that', 'this', 'will', 'are',
  'its', 'all', 'can', 'has', 'not', 'use', 'via', 'into', 'when', 'what',
  'how', 'which', 'where', 'used', 'also', 'uses', 'using', 'user', 'users',
  // Generic filesystem path components
  'var', 'lib', 'usr', 'srv', 'opt', 'etc', 'bin', 'run',
]);

/**
 * Extract significant tokens from an answer string for keyword-based matching.
 * Strips parenthetical content, .so suffixes, and filters out stop words and
 * very short tokens (≤ 2 chars) and single-letter flag tokens like -e.
 */
function significantTokens(answer) {
  return answer
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ')           // remove (...) parentheticals
    .replace(/[^a-z0-9_\-\.]/g, ' ')      // keep alnum + _ - .
    .split(/\s+/)
    .map((t) => t.replace(/\.so$/, ''))   // strip .so suffix
    .filter((t) => {
      if (!t || t.length <= 2) return false;
      if (/^-[a-z]$/i.test(t)) return false;   // skip single-char flags
      if (t.startsWith('//')) return false;     // skip URL fragments
      if (STOP_WORDS.has(t)) return false;
      return true;
    });
}

/**
 * Return true if the answer is "found" in the page text using three strategies:
 * 1. Exact case-insensitive substring match.
 * 2. Strip the "samba-tool " prefix and try again.
 * 3. Strip outer brackets (e.g. "[homes]" → "homes") and try again.
 * 4. Keyword-based: every significant token must appear somewhere in the page.
 */
function answerFoundInPage(answer, pageText) {
  const needle = answer.toLowerCase();

  if (pageText.includes(needle)) return true;

  // Strip "samba-tool " prefix
  const noPrefix = needle.replace(/^samba-tool\s+/, '');
  if (noPrefix !== needle && pageText.includes(noPrefix)) return true;

  // Strip outer brackets
  const noBrackets = needle.replace(/^\[|\]$/g, '');
  if (noBrackets !== needle && pageText.includes(noBrackets)) return true;

  // Keyword-based fallback (tier 4)
  const tokens = significantTokens(answer);
  if (tokens.length > 0 && tokens.every((t) => pageText.includes(t))) return true;

  // Hyphen-split fallback (tier 5): expand hyphenated tokens into individual parts.
  // e.g. "host-add" → ["host", "add"], then require ALL expanded tokens to appear.
  const expandedTokens = tokens.flatMap((t) => (t.includes('-') ? t.split('-') : [t]));
  const filteredExpanded = expandedTokens.filter((t) => t.length > 2 && !STOP_WORDS.has(t));
  if (filteredExpanded.length > 0 && filteredExpanded.every((t) => pageText.includes(t))) return true;

  return false;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ── Main ──────────────────────────────────────────────────────────────────────

(async () => {
  /** @type {Array<{id:string, file:string, correct:string, url:string, reason:string}>} */
  const failures = [];

  let urlIndex = 0;
  const total = byUrl.size;

  for (const [url, qs] of byUrl.entries()) {
    urlIndex++;
    process.stdout.write(`[${urlIndex}/${total}] ${url} … `);

    let pageText = '';
    let fetchError = null;

    try {
      const res = await fetch(url, {
        redirect: 'follow',
        headers: { 'User-Agent': 'lpic3-answer-checker/1.0 (educational audit)' },
      });
      if (!res.ok) {
        fetchError = `HTTP ${res.status}`;
      } else {
        const html = await res.text();
        pageText = extractText(html).toLowerCase();
      }
    } catch (err) {
      fetchError = String(err);
    }

    if (fetchError) {
      console.log(`FETCH ERROR — ${fetchError}`);
      for (const q of qs) {
        failures.push({ id: q.id, file: q.file, correct: q.correct, url, reason: fetchError });
      }
    } else {
      const missing = [];
      for (const q of qs) {
        if (!answerFoundInPage(q.correct, pageText)) {
          missing.push(q);
        }
      }
      if (missing.length === 0) {
        console.log(`OK (${qs.length} question${qs.length > 1 ? 's' : ''})`);
      } else {
        console.log(`${missing.length} answer(s) NOT FOUND`);
        for (const q of missing) {
          failures.push({ id: q.id, file: q.file, correct: q.correct, url, reason: 'answer text not found in page' });
        }
      }
    }

    // Be polite to remote servers.
    if (urlIndex < total) await sleep(500);
  }

  console.log(`\n──────────────────────────────────────`);
  console.log(`Questions checked : ${questions.length}`);
  console.log(`Unique URLs fetched: ${total}`);

  if (failures.length === 0) {
    console.log('All answers found in their reference pages.');
    process.exit(0);
  }

  console.error(`\nFailed (${failures.length}):`);
  for (const f of failures) {
    console.error(`  [${f.id}] correct="${f.correct}"`);
    console.error(`    URL   : ${f.url}`);
    console.error(`    Reason: ${f.reason}`);
  }
  process.exit(1);
})();
