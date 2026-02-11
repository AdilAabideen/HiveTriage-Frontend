/**
 * Hook for managing safety screen questions state and API calls
 */

import { useState, useEffect, useCallback } from 'react'
import { Question, SafetyScreenAnswerResponse, FinalAction } from '../types'
import { questionService } from '../services/questionService'

export interface SafetyScreenResult {
  isLastQuestion: boolean
  finalAction: FinalAction | null
  uiMessage: string | null
  encounterToken: string | null
}

export function useSafetyScreen(encounterId: string | null, shouldFetch: boolean) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<SafetyScreenResult | null>(null)

  // Fetch safety screen questions when triggered
  useEffect(() => {
    if (!shouldFetch) return
    
    const fetchQuestions = async () => {
      try {
        setIsLoading(true)
        const data: Question[] = await questionService.getSafetyScreenQuestions()
        setQuestions(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load safety screen questions')
      } finally {
        setIsLoading(false)
      }
    }
    fetchQuestions()
  }, [shouldFetch])

  const answerQuestion = useCallback(async (questionId: string, answer: string): Promise<SafetyScreenResult | null> => {
    if (!encounterId) {
      setError('No encounter ID available')
      return null
    }
    
    try {
      setIsSubmitting(true)
      const response: SafetyScreenAnswerResponse = await questionService.submitSafetyScreenAnswer(
        questionId, 
        answer, 
        encounterId
      )

      // Update local state
      setAnswers(prev => ({ ...prev, [questionId]: answer }))

      const screenResult: SafetyScreenResult = {
        isLastQuestion: response.is_last_question,
        finalAction: response.final_action,
        uiMessage: response.ui_message,
        encounterToken: response.encounter_token,
      }

      if (response.is_last_question) {
        setResult(screenResult)
      } else {
        setCurrentIndex(prev => prev + 1)
      }

      return screenResult
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit answer')
      return null
    } finally {
      setIsSubmitting(false)
    }
  }, [encounterId])

  const currentQuestion = questions[currentIndex]
  const progress = questions.length > 0 
    ? currentIndex / questions.length 
    : 0

  return {
    // State
    questions,
    answers,
    currentIndex,
    currentQuestion,
    isLoading,
    isSubmitting,
    error,
    result,
    progress,
    // Actions
    answerQuestion,
    setError,
  }
}

