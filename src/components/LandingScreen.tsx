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

        <div className="mt-6 border-t border-gray-100 pt-4 text-center">
          <p className="text-xs text-gray-500">
            Found an issue or want to contribute improvements?
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-sm">
            <a
              href="https://github.com/rilindo/lpic-3-exam-prep-mixed-env/issues/new/choose"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              Open an issue
            </a>
            <span className="text-gray-300" aria-hidden="true">|</span>
            <a
              href="https://github.com/rilindo/lpic-3-exam-prep-mixed-env/pulls"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              Create a pull request
            </a>
          </div>

          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-left">
            <p className="text-xs font-semibold text-amber-900">Disclaimer</p>
            <p className="mt-1 text-xs leading-relaxed text-amber-800">
              This practice content is community-generated from public documentation and reference
              materials. Contributions that copy or reproduce actual certification exam questions
              or protected test content will be rejected.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
