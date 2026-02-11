/**
 * Hook for managing registration questions state
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { Question } from '../types'
import { questionService } from '../services/questionService'

export interface RegistrationState {
  questions: Question[]
  answers: Record<string, string>
  currentIndex: number
  isLoading: boolean
  error: string | null
  encounterId: string | null
}

export function useRegistration() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [encounterId, setEncounterId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Ref to always have fresh answers (avoids stale closure)
  const answersRef = useRef<Record<string, string>>({})

  // Fetch registration questions on mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true)
        const data: Question[] = await questionService.getRegistrationQuestions()
        setQuestions(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load questions')
      } finally {
        setIsLoading(false)
      }
    }
    fetchQuestions()
  }, [])

  const answerQuestion = useCallback((questionId: string, answer: string) => {
    // Update both ref (synchronous, always fresh) and state (for UI)
    answersRef.current = { ...answersRef.current, [questionId]: answer }
    setAnswers(answersRef.current)
  }, [])

  const nextQuestion = useCallback(() => {
    setCurrentIndex(prev => prev + 1)
  }, [])

  const submitRegistration = useCallback(async (): Promise<string | null> => {
    // Use ref for fresh answers (never stale)
    try {
      setIsSubmitting(true)
      const response = await questionService.submitRegistration(answersRef.current)
      if (response?.encounter_id) {
        setEncounterId(response.encounter_id)
        return response.encounter_id
      }
      return null
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit registration')
      return null
    } finally {
      setIsSubmitting(false)
    }
  }, []) // No dependencies needed - ref is always current

  const currentQuestion = questions[currentIndex]
  const isComplete = currentIndex >= questions.length && questions.length > 0
  const progress = questions.length > 0 
    ? Object.keys(answers).length / questions.length 
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
    encounterId,
    isComplete,
    progress,
    // Actions
    answerQuestion,
    nextQuestion,
    submitRegistration,
    setEncounterId,
    setError,
  }
}

