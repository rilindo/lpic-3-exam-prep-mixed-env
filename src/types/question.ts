export type QuestionType = 'multiple_choice' | 'multiple_select' | 'fill_blank'

export type QuizMode = 'practice' | 'exam'

export interface Question {
  id: string
  type: QuestionType
  objective: string // e.g. "301.1"
  topic: string     // human-readable topic name
  question: string
  options?: [string, string, string, string] // always 4 options for MC/MS
  correct: string | string[]   // MC/fill_blank: string; multiple_select: string[]
  explanation: string
  reference: string // URL to official documentation
}

export interface QuizResult {
  question: Question
  userAnswer: string
  isCorrect: boolean
}

export interface ScoreSummary {
  correct: number
  incorrect: number
  total: number
  percentage: number
}
