/**
 * Registration Questions Phase
 */

import { useState } from 'react'
import { Question } from '../../../types'
import QuestionCard from '../QuestionCard'
import ProgressBar from '../ProgressBar'

export interface RegistrationPhaseProps {
  questions: Question[]
  answers: Record<string, string>
  progress: number
  onAnswer: (questionId: string, answer: string) => void
  onComplete: () => void
}

export function RegistrationPhase({
  questions,
  answers,
  progress,
  onAnswer,
  onComplete,
}: RegistrationPhaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentQuestion = questions[currentIndex]

  const handleAnswer = (questionId: string, answer: string) => {
    onAnswer(questionId, answer)

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1)
    } else {
      onComplete()
    }
  }

  return (
    <div className="min-h-screen bg-nhs flex flex-col items-center justify-center font-['Hind'] p-4 w-full">
      <div className="max-w-[60%] w-full flex flex-col items-center justify-center">
        <div className="mb-8 w-full">
          <ProgressBar progress={progress} label="Patient Registration" />
        </div>

        {currentQuestion && (
          <QuestionCard
            question={currentQuestion}
            onAnswer={handleAnswer}
            selectedAnswer={answers[currentQuestion.question_id]}
          />
        )}

        <p className="text-white/70 mt-24">
          Question {currentIndex + 1} of {questions.length}
        </p>
      </div>
    </div>
  )
}

export default RegistrationPhase

