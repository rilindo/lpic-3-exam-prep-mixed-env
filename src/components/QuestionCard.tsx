import { useState } from 'react'
import type { Question, QuizMode } from '../types/question'

interface QuestionCardProps {
  question: Question
  mode: QuizMode
  onAnswer: (answer: string) => void
  onNext: () => void
  isLast: boolean
}

export function QuestionCard({ question, mode, onAnswer, onNext, isLast }: QuestionCardProps) {
  const [selected, setSelected] = useState<string>('')
  const [fillValue, setFillValue] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (submitted) return
    const answer = question.type === 'multiple_choice' ? selected : fillValue
    if (!answer.trim()) return
    onAnswer(answer)
    setSubmitted(true)
  }

  const handleNext = () => {
    setSelected('')
    setFillValue('')
    setSubmitted(false)
    onNext()
  }

  const isCorrect =
    submitted &&
    (question.type === 'multiple_choice'
      ? selected === question.correct
      : fillValue.trim().toLowerCase() === question.correct.trim().toLowerCase())

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 w-full space-y-5">
      {/* Objective badge */}
      <div className="flex items-center gap-2">
        <span className="inline-block rounded-full bg-blue-100 px-3 py-0.5 text-xs font-medium text-blue-700">
          {question.objective}
        </span>
        <span className="text-xs text-gray-400">{question.topic}</span>
      </div>

      {/* Question text */}
      <p className="text-gray-900 font-medium text-base leading-relaxed">{question.question}</p>

      {/* Answer input */}
      {question.type === 'multiple_choice' && question.options ? (
        <fieldset className="space-y-2" disabled={submitted}>
          <legend className="sr-only">Choose an answer</legend>
          {question.options.map((option, idx) => {
            const letter = ['A', 'B', 'C', 'D'][idx] ?? ''
            const isSelected = selected === option
            const isRight = submitted && option === question.correct
            const isWrong = submitted && isSelected && option !== question.correct

            return (
              <label
                key={idx}
                className={[
                  'flex items-start gap-3 rounded-xl border-2 p-3 cursor-pointer transition-colors',
                  submitted
                    ? isRight
                      ? 'border-green-400 bg-green-50'
                      : isWrong
                        ? 'border-red-400 bg-red-50'
                        : 'border-gray-100 bg-gray-50 opacity-60'
                    : isSelected
                      ? 'border-blue-400 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50',
                ].join(' ')}
              >
                <input
                  type="radio"
                  name={`q-${question.id}`}
                  value={option}
                  checked={isSelected}
                  onChange={() => setSelected(option)}
                  className="mt-0.5 accent-blue-600"
                />
                <span className="text-xs font-bold text-gray-400 mt-0.5 w-4 shrink-0">{letter}</span>
                <span className="text-sm text-gray-800">{option}</span>
                {isRight && <span className="ml-auto text-green-600 text-sm font-semibold shrink-0">✓</span>}
                {isWrong && <span className="ml-auto text-red-500 text-sm font-semibold shrink-0">✗</span>}
              </label>
            )
          })}
        </fieldset>
      ) : (
        <div>
          <input
            type="text"
            value={fillValue}
            onChange={(e) => setFillValue(e.target.value)}
            disabled={submitted}
            placeholder="Type your answer…"
            className={[
              'w-full rounded-xl border-2 px-4 py-3 text-sm focus:outline-none focus:ring-2',
              submitted
                ? isCorrect
                  ? 'border-green-400 bg-green-50 text-green-800'
                  : 'border-red-400 bg-red-50 text-red-800'
                : 'border-gray-200 bg-gray-50 focus:border-blue-400 focus:ring-blue-100',
            ].join(' ')}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit()
            }}
          />
          {submitted && !isCorrect && (
            <p className="mt-2 text-xs text-green-700 font-medium">
              Correct answer: <span className="font-mono">{question.correct}</span>
            </p>
          )}
        </div>
      )}

      {/* Explanation + reference (after submit) */}
      {submitted && (
        <div className={`rounded-xl p-4 text-sm ${isCorrect ? 'bg-green-50 text-green-900' : 'bg-red-50 text-red-900'}`}>
          <p className="font-semibold mb-1">{isCorrect ? '✓ Correct!' : '✗ Incorrect'}</p>
          <p className="text-gray-700">{question.explanation}</p>
          {mode === 'practice' && (
            <a
              href={question.reference}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-blue-600 underline text-xs break-all"
            >
              {question.reference}
            </a>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={question.type === 'multiple_choice' ? !selected : !fillValue.trim()}
            className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex-1 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 transition-colors"
          >
            {isLast ? 'Finish Quiz' : 'Next Question →'}
          </button>
        )}
      </div>
    </div>
  )
}
