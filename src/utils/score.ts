import type { QuizResult, ScoreSummary } from '../types/question'

export function calculateScore(results: QuizResult[]): ScoreSummary {
  const correct = results.filter((r) => r.isCorrect).length
  const total = results.length
  const incorrect = total - correct
  const percentage = total === 0 ? 0 : Math.round((correct / total) * 100)
  return { correct, incorrect, total, percentage }
}

/**
 * Case-insensitive, trimmed comparison for fill-in-the-blank answers.
 * For multiple_select, userAnswer is a ' | '-joined sorted string;
 * correct is a string[]. Both are sorted and compared case-insensitively.
 */
export function isAnswerCorrect(userAnswer: string, correct: string | string[]): boolean {
  if (Array.isArray(correct)) {
    const userSorted = userAnswer.split(' | ').map((s) => s.trim().toLowerCase()).sort().join('|')
    const correctSorted = [...correct].map((s) => s.trim().toLowerCase()).sort().join('|')
    return userSorted === correctSorted
  }
  return userAnswer.trim().toLowerCase() === correct.trim().toLowerCase()
}
