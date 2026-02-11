/**
 * Safety Screen Questions Phase
 */

import { useState } from 'react'
import { Question } from '../../../types'
import QuestionCard from '../QuestionCard'
import ProgressBar from '../ProgressBar'

export interface SafetyScreenPhaseProps {
  currentQuestion: Question | undefined
  currentIndex: number
  totalQuestions: number
  answers: Record<string, string>
  progress: number
  onAnswer: (questionId: string, answer: string) => Promise<void>
}

export function SafetyScreenPhase({
  currentQuestion,
  currentIndex,
  totalQuestions,
  answers,
  progress,
  onAnswer,
}: SafetyScreenPhaseProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAnswer = async (questionId: string, answer: string) => {
    setIsSubmitting(true)
    await onAnswer(questionId, answer)
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-nhs flex flex-col items-center justify-center font-['Hind'] p-4">
      <div className="max-w-[60%] w-full flex flex-col items-center justify-center">
        <div className="mb-8 w-full">
          <ProgressBar progress={progress} label="Safety Screening" />
        </div>

        {currentQuestion && (
          <QuestionCard
            question={currentQuestion}
            onAnswer={handleAnswer}
            selectedAnswer={answers[currentQuestion.question_id]}
          />
        )}

        <p className="text-white/70 mt-6">
          {isSubmitting 
            ? 'Submitting...' 
            : `Question ${currentIndex + 1} of ${totalQuestions}`
          }
        </p>
      </div>
    </div>
  )
}

export default SafetyScreenPhase

