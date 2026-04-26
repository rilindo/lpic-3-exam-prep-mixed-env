import './index.css'
import { useQuiz } from './hooks/useQuiz'
import { HomeScreen } from './components/HomeScreen'
import { QuizScreen } from './components/QuizScreen'
import { ResultsScreen } from './components/ResultsScreen'

export default function App() {
  const quiz = useQuiz()

  if (quiz.state === 'idle') {
    return <HomeScreen onStart={quiz.startQuiz} />
  }

  if (quiz.state === 'active') {
    return <QuizScreen mode={quiz.mode} quiz={quiz} />
  }

  return <ResultsScreen results={quiz.results} onReset={quiz.resetQuiz} />
}
