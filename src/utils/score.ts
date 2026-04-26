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
 */
export function isAnswerCorrect(userAnswer: string, correct: string): boolean {
  return userAnswer.trim().toLowerCase() === correct.trim().toLowerCase()
}
