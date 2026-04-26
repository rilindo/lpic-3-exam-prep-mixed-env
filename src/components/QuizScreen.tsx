import type { QuizMode } from '../types/question'
import { useQuiz } from '../hooks/useQuiz'
import { ProgressBar } from './ProgressBar'
import { QuestionCard } from './QuestionCard'

interface QuizScreenProps {
  mode: QuizMode
  quiz: ReturnType<typeof useQuiz>
}

export function QuizScreen({ mode, quiz }: QuizScreenProps) {
  const { currentQuestion, currentIndex, questions } = quiz

  if (!currentQuestion) return null

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-4">
        <div className="flex items-center justify-between">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${mode === 'practice' ? 'bg-blue-100 text-blue-700' : 'bg-indigo-100 text-indigo-700'}`}>
            {mode === 'practice' ? 'Practice Mode' : 'Exam Mode'}
          </span>
          <button
            onClick={quiz.resetQuiz}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕ Exit
          </button>
        </div>

        <ProgressBar current={currentIndex + 1} total={questions.length} />

        <QuestionCard
          question={currentQuestion}
          mode={mode}
          onAnswer={quiz.answerQuestion}
          onNext={quiz.nextQuestion}
          isLast={currentIndex === questions.length - 1}
        />
      </div>
    </div>
  )
}
