import { useState } from 'react'
import type { QuizResult } from '../types/question'
import { calculateScore } from '../utils/score'
import { sanitizeUrl } from '../utils/url'

interface ResultsScreenProps {
  results: QuizResult[]
  onReset: () => void
}

export function ResultsScreen({ results, onReset }: ResultsScreenProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const { correct, incorrect, total, percentage } = calculateScore(results)

  const scoreColor =
    percentage >= 70 ? 'text-green-600' : percentage >= 50 ? 'text-yellow-500' : 'text-red-500'

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6 py-8">
        {/* Summary card */}
        <div className="bg-white rounded-2xl shadow-md p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Quiz Complete</h2>
          <p className={`text-5xl font-extrabold my-4 ${scoreColor}`}>{percentage}%</p>
          <div className="flex justify-center gap-8 text-sm text-gray-600">
            <div>
              <span className="block text-2xl font-bold text-green-600">{correct}</span>
              Correct
            </div>
            <div>
              <span className="block text-2xl font-bold text-red-500">{incorrect}</span>
              Incorrect
            </div>
            <div>
              <span className="block text-2xl font-bold text-gray-700">{total}</span>
              Total
            </div>
          </div>
          <button
            onClick={onReset}
            className="mt-6 rounded-xl bg-blue-600 px-8 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>

        {/* Result list */}
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide px-1">
          Review All Questions
        </h3>
        <div className="space-y-3">
          {results.map((result, idx) => (
            <div
              key={result.question.id}
              className={`bg-white rounded-xl shadow-sm border-l-4 ${result.isCorrect ? 'border-green-400' : 'border-red-400'}`}
            >
              <button
                className="w-full flex items-start gap-3 p-4 text-left"
                onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
                aria-expanded={activeIndex === idx}
              >
                <span className={`mt-0.5 shrink-0 font-bold text-sm ${result.isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                  {result.isCorrect ? '✓' : '✗'}
                </span>
                <span className="flex-1 text-sm text-gray-800">{result.question.question}</span>
                <span className="text-gray-400 text-xs shrink-0">{activeIndex === idx ? '▲' : '▼'}</span>
              </button>

              {activeIndex === idx && (
                <div className="px-4 pb-4 space-y-2 text-sm">
                  <div className="flex gap-2">
                    <span className="text-gray-500 shrink-0">Your answer:</span>
                    <span className={result.isCorrect ? 'text-green-700 font-medium' : 'text-red-600 font-medium'}>
                      {result.userAnswer || '(no answer)'}
                    </span>
                  </div>
                  {!result.isCorrect && (
                    <div className="flex gap-2">
                      <span className="text-gray-500 shrink-0">Correct answer:</span>
                      <span className="text-green-700 font-medium">{result.question.correct}</span>
                    </div>
                  )}
                  <p className="text-gray-600 text-xs">{result.question.explanation}</p>
                  <a
                    href={sanitizeUrl(result.question.reference)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-blue-600 underline text-xs break-all"
                  >
                    {result.question.reference}
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
