import { describe, expect, it } from 'vitest'
import { calculateScore, isAnswerCorrect } from '../../src/utils/score'

describe('calculateScore', () => {
  it('calculates mixed results', () => {
    const summary = calculateScore([
      {
        question: {} as never,
        userAnswer: 'a',
        isCorrect: true,
      },
      {
        question: {} as never,
        userAnswer: 'b',
        isCorrect: false,
      },
    ])

    expect(summary).toEqual({
      correct: 1,
      incorrect: 1,
      total: 2,
      percentage: 50,
    })
  })

  it('handles zero results', () => {
    expect(calculateScore([])).toEqual({
      correct: 0,
      incorrect: 0,
      total: 0,
      percentage: 0,
    })
  })
})

describe('isAnswerCorrect', () => {
  it('compares answers case-insensitively and trimmed', () => {
    expect(isAnswerCorrect('  WinBindD ', 'winbindd')).toBe(true)
  })

  it('returns true for multiple_select when all correct options are selected (any order)', () => {
    expect(isAnswerCorrect('vers=4 | nfsvers=4', ['nfsvers=4', 'vers=4'])).toBe(true)
  })

  it('returns false for multiple_select when only a subset is selected', () => {
    expect(isAnswerCorrect('vers=4', ['nfsvers=4', 'vers=4'])).toBe(false)
  })

  it('returns false for multiple_select when a wrong option is selected', () => {
    expect(isAnswerCorrect('proto=nfsv4 | vers=4', ['nfsvers=4', 'vers=4'])).toBe(false)
  })
})
