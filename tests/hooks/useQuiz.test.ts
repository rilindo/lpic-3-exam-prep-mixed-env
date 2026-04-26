import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useQuiz } from '../../src/hooks/useQuiz'

describe('useQuiz', () => {
  it('starts a quiz and reaches completion', () => {
    const { result } = renderHook(() => useQuiz())

    act(() => {
      result.current.startQuiz('practice', 5)
    })

    expect(result.current.state).toBe('active')
    expect(result.current.questions).toHaveLength(5)
    expect(result.current.currentIndex).toBe(0)

    for (let index = 0; index < 5; index += 1) {
      act(() => {
        result.current.answerQuestion('test')
      })
      act(() => {
        result.current.nextQuestion()
      })
    }

    expect(result.current.state).toBe('complete')
    expect(result.current.results).toHaveLength(5)
  })

  it('resets back to idle', () => {
    const { result } = renderHook(() => useQuiz())

    act(() => {
      result.current.startQuiz('exam', 5)
    })

    act(() => {
      result.current.resetQuiz()
    })

    expect(result.current.state).toBe('idle')
    expect(result.current.questions).toEqual([])
    expect(result.current.results).toEqual([])
  })
})
