interface LandingScreenProps {
  onReview: () => void
  onExams: () => void
}

export function LandingScreen({ onReview, onExams }: LandingScreenProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">LPIC-3 Exam 300</h1>
        <p className="text-gray-400 text-sm mb-8">Mixed Environments · Objectives v3.0</p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button
            onClick={onReview}
            className="flex flex-col items-start gap-3 rounded-xl border-2 border-gray-100 p-6 text-left transition-all hover:border-emerald-400 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
          >
            <span className="text-3xl" aria-hidden="true">📚</span>
            <div>
              <div className="font-semibold text-gray-900">Review</div>
              <div className="mt-1 text-sm text-gray-500">
                Browse objective summaries and reference links
              </div>
            </div>
          </button>

          <button
            onClick={onExams}
            className="flex flex-col items-start gap-3 rounded-xl border-2 border-gray-100 p-6 text-left transition-all hover:border-blue-400 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            <span className="text-3xl" aria-hidden="true">✏️</span>
            <div>
              <div className="font-semibold text-gray-900">Practice &amp; Exam</div>
              <div className="mt-1 text-sm text-gray-500">
                Test your knowledge with practice questions
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
