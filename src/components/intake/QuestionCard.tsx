import { useEffect, useState } from 'react'
import { Question } from '../../types/question'

interface QuestionCardProps {
  question: Question
  onAnswer: (questionId: string, answer: string) => void
  selectedAnswer?: string
  disabled?: boolean
}

function QuestionCard({ question, onAnswer, selectedAnswer, disabled }: QuestionCardProps) {
  const [currentAnswer, setCurrentAnswer] = useState(selectedAnswer || '')

  const handleNext = () => {
    if (currentAnswer) {
      onAnswer(question.question_id, currentAnswer)
    }
  }

  const handleOptionSelect = (option: string) => {
    setCurrentAnswer(option)
  }


  useEffect(() => {
    setCurrentAnswer(selectedAnswer || '')
  }, [question.question_id, selectedAnswer])

  const renderInput = () => {

    // Text input
    if (question.response_format === 'text') {
      return (
        <input
          type="text"
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
          disabled={disabled}
          placeholder="Type your answer..."
          className="w-full py-4 px-6 rounded-xl text-lg font-medium bg-white text-gray-800 border-2 border-white focus:outline-none focus:ring-2 focus:ring-white/50"
        />
      )
    }

    // Date input
    if (question.response_format === 'date') {
      return (
        <input
          type="date"
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
          disabled={disabled}
          className="w-full py-4 px-6 rounded-xl text-lg font-medium bg-white text-gray-800 border-2 border-white focus:outline-none focus:ring-2 focus:ring-white/50"
        />
      )
    }

    // Multiple choice (default)
    return (
      <div className="flex flex-row gap-3 flex-wrap">
        {question.response_options?.map((option) => (
          <button
            key={option}
            onClick={() => handleOptionSelect(option)}
            disabled={disabled}
            className={`
              border-2 border-white py-4 px-6 rounded-xl text-lg font-medium transition-all duration-200
              ${currentAnswer === option 
                ? 'bg-white text-nhs' 
                : 'bg-transparent text-white hover:bg-white/20'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {option.charAt(0).toUpperCase() + option.slice(1).replace('_', ' ')}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-start justify-center rounded-2xl w-full">
      <p className="text-white text-6xl font-medium mb-6 text-start">
        {question.text}
      </p>
      
      {renderInput()}

      <button
        onClick={handleNext}
        disabled={disabled || !currentAnswer}
        className={`
          mt-8 py-4 px-12 rounded-full text-xl font-medium transition-all duration-200
          ${currentAnswer 
            ? 'bg-white text-nhs cursor-pointer hover:bg-gray-100' 
            : 'bg-white/30 text-white/50 cursor-not-allowed'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        Next
      </button>
    </div>
  )
}

export default QuestionCard
