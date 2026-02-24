import { useEffect, useMemo, useState } from 'react'
import { Button, TextArea } from '../ui'
import { TriageQuestion } from '../../types'

interface TriageQuestionCardProps {
  question: TriageQuestion
  onSubmit: (answer: string[]) => void
  disabled?: boolean
}

function TriageQuestionCard({ question, onSubmit, disabled }: TriageQuestionCardProps) {
  const [openEndedAnswer, setOpenEndedAnswer] = useState('')
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])

  const isOpenEnded = question.question_type === 'open_ended'
  const isMultiSelect = question.question_type === 'multi_select'

  useEffect(() => {
    setOpenEndedAnswer('')
    setSelectedAnswers([])
  }, [question.question_text, question.question_type])

  const answerPayload = useMemo(() => {
    if (isOpenEnded) {
      return openEndedAnswer.trim() ? [openEndedAnswer.trim()] : []
    }

    return selectedAnswers
  }, [isOpenEnded, openEndedAnswer, selectedAnswers])

  const isSubmitDisabled = disabled || answerPayload.length === 0

  const handleOptionToggle = (internalLabel: string) => {
    if (isMultiSelect) {
      setSelectedAnswers((prev) =>
        prev.includes(internalLabel)
          ? prev.filter((label) => label !== internalLabel)
          : [...prev, internalLabel]
      )
      return
    }

    setSelectedAnswers([internalLabel])
  }

  const handleSubmit = () => {
    if (isSubmitDisabled) return
    onSubmit(answerPayload)
  }

  return (
    <div className="flex flex-col items-start justify-center rounded-2xl w-full">
      <p className="text-white text-5xl font-medium mb-4 text-start">
        {question.question_text}
      </p>
      {question.patient_facing_hint && (
        <p className="text-white/80 text-xl mb-6">{question.patient_facing_hint}</p>
      )}

      {isOpenEnded ? (
        <TextArea
          value={openEndedAnswer}
          onChange={(event) => setOpenEndedAnswer(event.target.value)}
          placeholder="Type your answer..."
          disabled={disabled}
        />
      ) : (
        <div className="flex flex-row gap-3 flex-wrap">
          {question.options?.map((option) => {
            const isSelected = selectedAnswers.includes(option.internal_label)
            return (
              <button
                key={option.internal_label}
                onClick={() => handleOptionToggle(option.internal_label)}
                disabled={disabled}
                className={
                  `border-2 border-white py-4 px-6 rounded-xl text-lg font-medium transition-all duration-200 ` +
                  `${isSelected ? 'bg-white text-nhs' : 'bg-transparent text-white hover:bg-white/20'} ` +
                  `${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`
                }
              >
                {option.patient_facing_label}
              </button>
            )
          })}
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={isSubmitDisabled}
        className="mt-8"
      >
        Next
      </Button>
    </div>
  )
}

export default TriageQuestionCard
