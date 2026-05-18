import type { FormEvent } from 'react'
import type { QuizMode } from '../types/question'

const QUESTION_COUNTS = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100]

interface HomeScreenProps {
  onStart: (mode: QuizMode, count: number) => void
  onBack?: () => void
}

export function HomeScreen({ onStart, onBack }: HomeScreenProps) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const mode = (form.elements.namedItem('mode') as RadioNodeList).value as QuizMode
    const count = parseInt((form.elements.namedItem('count') as HTMLSelectElement).value, 10)
    onStart(mode, count)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors mb-6"
          >
            ← Menu
          </button>
        )}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">LPIC-3 Exam 300 Prep</h1>
        <p className="text-gray-500 mb-8 text-sm">Mixed Environments · Objectives v3.0</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mode */}
          <fieldset>
            <legend className="text-sm font-semibold text-gray-700 mb-3">Select Mode</legend>
            <div className="grid grid-cols-2 gap-3">
              <label className="relative flex cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="practice"
                  defaultChecked
                  className="peer sr-only"
                />
                <span className="w-full rounded-xl border-2 border-gray-200 p-4 text-center text-sm font-medium text-gray-700 peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-700 transition-colors">
                  <span className="block text-lg mb-1">📖</span>
                  Practice Mode
                  <span className="block text-xs text-gray-400 peer-checked:text-blue-400 mt-1">
                    References shown live
                  </span>
                </span>
              </label>
              <label className="relative flex cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="exam"
                  className="peer sr-only"
                />
                <span className="w-full rounded-xl border-2 border-gray-200 p-4 text-center text-sm font-medium text-gray-700 peer-checked:border-indigo-500 peer-checked:bg-indigo-50 peer-checked:text-indigo-700 transition-colors">
                  <span className="block text-lg mb-1">🎓</span>
                  Exam Mode
                  <span className="block text-xs text-gray-400 mt-1">
                    References after completion
                  </span>
                </span>
              </label>
            </div>
          </fieldset>

          {/* Question count */}
          <div>
            <label htmlFor="count" className="block text-sm font-semibold text-gray-700 mb-2">
              Number of Questions
            </label>
            <select
              id="count"
              name="count"
              defaultValue={60}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              {QUESTION_COUNTS.map((n) => (
                <option key={n} value={n}>
                  {n} questions
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 active:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            Start
          </button>
        </form>
      </div>
    </div>
  )
}
