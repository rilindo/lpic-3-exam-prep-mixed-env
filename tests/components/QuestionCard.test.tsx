import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { QuestionCard } from '../../src/components/QuestionCard'
import type { Question } from '../../src/types/question'

const multipleChoiceQuestion: Question = {
  id: 'test-mc',
  type: 'multiple_choice',
  objective: '301.1',
  topic: 'Samba Concepts',
  question: 'Which daemon serves SMB file shares?',
  options: ['nmbd', 'winbindd', 'smbd', 'rpcd'],
  correct: 'smbd',
  explanation: 'smbd serves file and print shares.',
  reference: 'https://example.com/ref',
}

const fillBlankQuestion: Question = {
  id: 'test-fill',
  type: 'fill_blank',
  objective: '301.1',
  topic: 'Samba Concepts',
  question: 'Type the daemon name.',
  correct: 'smbd',
  explanation: 'smbd serves file and print shares.',
  reference: 'https://example.com/ref',
}

describe('QuestionCard', () => {
  it('shows reference in practice mode after submit', () => {
    const onAnswer = vi.fn()
    const onNext = vi.fn()

    render(
      <QuestionCard
        question={multipleChoiceQuestion}
        mode="practice"
        onAnswer={onAnswer}
        onNext={onNext}
        isLast={false}
      />,
    )

    fireEvent.click(screen.getByLabelText(/smbd/i))
    fireEvent.click(screen.getByRole('button', { name: /submit answer/i }))

    expect(onAnswer).toHaveBeenCalledWith('smbd')
    expect(screen.getByText('https://example.com/ref')).toBeInTheDocument()
  })

  it('hides reference in exam mode during question review', () => {
    render(
      <QuestionCard
        question={fillBlankQuestion}
        mode="exam"
        onAnswer={() => undefined}
        onNext={() => undefined}
        isLast={false}
      />,
    )

    fireEvent.change(screen.getByPlaceholderText(/type your answer/i), {
      target: { value: 'smbd' },
    })
    fireEvent.click(screen.getByRole('button', { name: /submit answer/i }))

    expect(screen.queryByText('https://example.com/ref')).not.toBeInTheDocument()
  })
})
