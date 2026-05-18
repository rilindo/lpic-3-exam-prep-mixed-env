import { useState } from 'react'
import './index.css'
import { useQuiz } from './hooks/useQuiz'
import { LandingScreen } from './components/LandingScreen'
import { HomeScreen } from './components/HomeScreen'
import { QuizScreen } from './components/QuizScreen'
import { ResultsScreen } from './components/ResultsScreen'
import { ReviewScreen } from './components/ReviewScreen'

type AppView = 'landing' | 'review' | 'exams'

export default function App() {
  const [view, setView] = useState<AppView>('landing')
  const quiz = useQuiz()

  if (view === 'landing') {
    return (
      <LandingScreen
        onReview={() => setView('review')}
        onExams={() => setView('exams')}
      />
    )
  }

  if (view === 'review') {
    return <ReviewScreen onBack={() => setView('landing')} />
  }

  // view === 'exams'
  if (quiz.state === 'idle') {
    return <HomeScreen onStart={quiz.startQuiz} onBack={() => setView('landing')} />
  }

  if (quiz.state === 'active') {
    return <QuizScreen mode={quiz.mode} quiz={quiz} />
  }

  return <ResultsScreen results={quiz.results} onReset={quiz.resetQuiz} />
}
