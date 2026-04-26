import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ResultsScreen } from '../../src/components/ResultsScreen'
import type { QuizResult } from '../../src/types/question'

const results: QuizResult[] = [
  {
    question: {
      id: 'one',
      type: 'multiple_choice',
      objective: '301.1',
      topic: 'Topic',
      question: 'First question?',
      options: ['A', 'B', 'C', 'D'],
      correct: 'A',
      explanation: 'Because A is correct.',
      reference: 'https://example.com/one',
    },
    userAnswer: 'A',
    isCorrect: true,
  },
  {
    question: {
      id: 'two',
      type: 'fill_blank',
      objective: '301.2',
      topic: 'Topic',
      question: 'Second question?',
      correct: 'answer',
      explanation: 'Because answer is correct.',
      reference: 'https://example.com/two',
    },
    userAnswer: 'wrong',
    isCorrect: false,
  },
]

describe('ResultsScreen', () => {
  it('shows summary counts and expandable references', () => {
    const onReset = vi.fn()
    render(<ResultsScreen results={results} onReset={onReset} />)

    expect(screen.getByText('Quiz Complete')).toBeInTheDocument()
    expect(screen.getByText('50%')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /first question/i }))
    expect(screen.getByText('https://example.com/one')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /back to home/i }))
    expect(onReset).toHaveBeenCalled()
  })
})
