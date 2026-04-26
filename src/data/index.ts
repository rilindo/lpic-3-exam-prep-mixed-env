import type { Question } from '../types/question'
import { shuffle } from '../utils/shuffle'

// Static imports of all 20 question bank files
import q301_1 from './questions/301.1.json'
import q301_2 from './questions/301.2.json'
import q301_3 from './questions/301.3.json'
import q301_4 from './questions/301.4.json'
import q302_1 from './questions/302.1.json'
import q302_2 from './questions/302.2.json'
import q302_3 from './questions/302.3.json'
import q302_4 from './questions/302.4.json'
import q302_5 from './questions/302.5.json'
import q303_1 from './questions/303.1.json'
import q303_2 from './questions/303.2.json'
import q303_3 from './questions/303.3.json'
import q303_4 from './questions/303.4.json'
import q304_1 from './questions/304.1.json'
import q304_2 from './questions/304.2.json'
import q304_3 from './questions/304.3.json'
import q305_1 from './questions/305.1.json'
import q305_2 from './questions/305.2.json'
import q305_3 from './questions/305.3.json'
import q305_4 from './questions/305.4.json'

// Weights match the official LPIC-3 Exam 300 v3.0 objectives
const BANKS: { weight: number; questions: Question[] }[] = [
  { weight: 2, questions: q301_1 as Question[] },
  { weight: 4, questions: q301_2 as Question[] },
  { weight: 2, questions: q301_3 as Question[] },
  { weight: 3, questions: q301_4 as Question[] },
  { weight: 5, questions: q302_1 as Question[] },
  { weight: 2, questions: q302_2 as Question[] },
  { weight: 4, questions: q302_3 as Question[] },
  { weight: 4, questions: q302_4 as Question[] },
  { weight: 2, questions: q302_5 as Question[] },
  { weight: 4, questions: q303_1 as Question[] },
  { weight: 3, questions: q303_2 as Question[] },
  { weight: 1, questions: q303_3 as Question[] },
  { weight: 2, questions: q303_4 as Question[] },
  { weight: 5, questions: q304_1 as Question[] },
  { weight: 3, questions: q304_2 as Question[] },
  { weight: 3, questions: q304_3 as Question[] },
  { weight: 2, questions: q305_1 as Question[] },
  { weight: 4, questions: q305_2 as Question[] },
  { weight: 2, questions: q305_3 as Question[] },
  { weight: 3, questions: q305_4 as Question[] },
]

const ALL_QUESTIONS: Question[] = BANKS.flatMap((b) => b.questions)
const TOTAL_WEIGHT = BANKS.reduce((sum, b) => sum + b.weight, 0)

/**
 * Returns a weighted-proportional, shuffled selection of `count` questions.
 * Heavier objectives contribute proportionally more questions to the draw.
 */
export function getQuestions(count: number): Question[] {
  const selected: Question[] = []

  for (const bank of BANKS) {
    const allocation = Math.round((bank.weight / TOTAL_WEIGHT) * count)
    const available = shuffle(bank.questions)
    selected.push(...available.slice(0, Math.min(allocation, available.length)))
  }

  // Top up or trim to exact count using shuffled remainder
  const shuffledAll = shuffle(ALL_QUESTIONS)
  const selectedIds = new Set(selected.map((q) => q.id))

  for (const q of shuffledAll) {
    if (selected.length >= count) break
    if (!selectedIds.has(q.id)) {
      selected.push(q)
      selectedIds.add(q.id)
    }
  }

  return shuffle(selected).slice(0, count)
}

export { ALL_QUESTIONS }
