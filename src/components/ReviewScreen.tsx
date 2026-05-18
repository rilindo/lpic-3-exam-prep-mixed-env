import { useState } from 'react'
import {
  PARENT_TOPICS,
  OBJECTIVE_MAP,
  getObjectiveReferences,
} from '../data/review'

interface ReviewScreenProps {
  onBack: () => void
}

export function ReviewScreen({ onBack }: ReviewScreenProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(PARENT_TOPICS.map((p) => p.id)),
  )
  const [mobileShowContent, setMobileShowContent] = useState(false)

  const info = selectedId ? OBJECTIVE_MAP.get(selectedId) : null
  const refs = selectedId ? getObjectiveReferences(selectedId) : []

  function handleSelect(id: string) {
    setSelectedId(id)
    setMobileShowContent(true)
  }

  function toggleGroup(groupId: string) {
    setExpandedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(groupId)) next.delete(groupId)
      else next.add(groupId)
      return next
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          ← Back
        </button>
        <span className="text-gray-200" aria-hidden="true">|</span>
        <h1 className="text-sm font-semibold text-gray-700">
          LPIC-3 Exam 300 – Objective Review
        </h1>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`w-72 bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto ${
            mobileShowContent ? 'hidden md:block' : 'block'
          }`}
        >
          <nav className="py-2">
            {PARENT_TOPICS.map((group) => (
              <div key={group.id}>
                <button
                  onClick={() => toggleGroup(group.id)}
                  className="w-full flex items-start justify-between px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:bg-gray-50 transition-colors"
                >
                  <span className="flex-1 text-left">{group.label}</span>
                  <span className="flex-shrink-0 text-gray-400 ml-2 mt-px">
                    {expandedGroups.has(group.id) ? '▾' : '▸'}
                  </span>
                </button>

                {expandedGroups.has(group.id) && (
                  <ul>
                    {group.objectives.map((objId) => {
                      const obj = OBJECTIVE_MAP.get(objId)
                      if (!obj) return null
                      const isSelected = selectedId === objId
                      return (
                        <li key={objId}>
                          <button
                            onClick={() => handleSelect(objId)}
                            className={`w-full text-left px-4 py-2.5 pl-6 transition-colors border-r-2 ${
                              isSelected
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-500'
                                : 'text-gray-700 border-transparent hover:bg-gray-50 hover:text-gray-900'
                            }`}
                          >
                            <span className="block text-xs font-mono text-gray-400 mb-0.5">{objId}</span>
                            <span className={`block text-sm leading-snug ${isSelected ? 'font-medium' : ''}`}>{obj.topic}</span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            ))}
          </nav>
        </aside>

        {/* Content area */}
        <main
          className={`flex-1 overflow-y-auto ${
            !mobileShowContent && !selectedId ? 'hidden md:flex items-center justify-center' : ''
          }`}
        >
          {/* Mobile: back to list */}
          {mobileShowContent && (
            <div className="md:hidden px-4 pt-4">
              <button
                onClick={() => setMobileShowContent(false)}
                className="text-sm text-emerald-600 hover:text-emerald-800 flex items-center gap-1 mb-4"
              >
                ← Objectives list
              </button>
            </div>
          )}

          {info ? (
            <div className="px-6 py-6 max-w-3xl">
              {/* Title */}
              <div className="mb-6">
                <span className="inline-block text-xs font-mono bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded mb-2">
                  {info.id}
                </span>
                <h2 className="text-2xl font-bold text-gray-900">{info.topic}</h2>
                <p className="mt-2 text-gray-600 leading-relaxed">{info.overview}</p>
              </div>

              {/* Key Concepts */}
              <section className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Key Concepts
                </h3>
                <ul className="space-y-2.5">
                  {info.keyPoints.map((point, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-700 leading-relaxed">
                      <span className="mt-0.5 text-emerald-500 flex-shrink-0 select-none">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Key Commands */}
              {info.keyCommands.length > 0 && (
                <section className="mb-6">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Key Commands
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {info.keyCommands.map((cmd) => (
                      <code
                        key={cmd}
                        className="px-2.5 py-1 bg-gray-100 rounded text-xs font-mono text-gray-800"
                      >
                        {cmd}
                      </code>
                    ))}
                  </div>
                </section>
              )}

              {/* Key Files */}
              {info.keyFiles.length > 0 && (
                <section className="mb-6">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Key Files &amp; Paths
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {info.keyFiles.map((file) => (
                      <code
                        key={file}
                        className="px-2.5 py-1 bg-blue-50 rounded text-xs font-mono text-blue-800"
                      >
                        {file}
                      </code>
                    ))}
                  </div>
                </section>
              )}

              {/* References */}
              {refs.length > 0 && (
                <section>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    References
                  </h3>
                  <ul className="space-y-1.5">
                    {refs.map((ref) => (
                      <li key={ref.url} className="flex items-start gap-2 text-sm">
                        <span className="mt-0.5 text-gray-300 flex-shrink-0 select-none">→</span>
                        <a
                          href={ref.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline break-all"
                        >
                          {ref.url}
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          ) : (
            <div className="hidden md:flex flex-col items-center justify-center text-center text-gray-400 h-full py-20">
              <span className="text-5xl mb-4" aria-hidden="true">📖</span>
              <p className="text-sm">Select an objective from the sidebar to begin reviewing</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
