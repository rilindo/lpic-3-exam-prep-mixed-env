import { useState, useCallback } from 'react'
import type { Question, QuizMode, QuizResult } from '../types/question'
import { getQuestions } from '../data'
import { isAnswerCorrect } from '../utils/score'

type QuizState = 'idle' | 'active' | 'complete'

interface UseQuizReturn {
  state: QuizState
  mode: QuizMode
  questions: Question[]
  currentIndex: number
  results: QuizResult[]
  currentQuestion: Question | null
  startQuiz: (mode: QuizMode, count: number) => void
  answerQuestion: (answer: string) => void
  nextQuestion: () => void
  resetQuiz: () => void
}

export function useQuiz(): UseQuizReturn {
  const [state, setState] = useState<QuizState>('idle')
  const [mode, setMode] = useState<QuizMode>('practice')
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [results, setResults] = useState<QuizResult[]>([])

  const startQuiz = useCallback((newMode: QuizMode, count: number) => {
    const selected = getQuestions(count)
    setMode(newMode)
    setQuestions(selected)
    setCurrentIndex(0)
    setResults([])
    setState('active')
  }, [])

  const answerQuestion = useCallback(
    (answer: string) => {
      const question = questions[currentIndex]
      if (!question) return
      const isCorrect = isAnswerCorrect(answer, question.correct)
      setResults((prev) => [...prev, { question, userAnswer: answer, isCorrect }])
    },
    [questions, currentIndex],
  )

  const nextQuestion = useCallback(() => {
    setCurrentIndex((prev) => {
      const next = prev + 1
      if (next >= questions.length) {
        setState('complete')
      }
      return next
    })
  }, [questions.length])

  const resetQuiz = useCallback(() => {
    setState('idle')
    setQuestions([])
    setCurrentIndex(0)
    setResults([])
  }, [])

  const currentQuestion = state === 'active' ? (questions[currentIndex] ?? null) : null

  return {
    state,
    mode,
    questions,
    currentIndex,
    results,
    currentQuestion,
    startQuiz,
    answerQuestion,
    nextQuestion,
    resetQuiz,
  }
}
