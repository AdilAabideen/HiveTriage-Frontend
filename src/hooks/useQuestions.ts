import { useState, useEffect } from 'react'
import { questionService } from '../services/questionService'

interface UseQuestionsResult<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useQuestions<T>(): UseQuestionsResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true)
        const result = await questionService.getPreliminaryQuestions()
        setData(result as T)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [])

  return { data, loading, error }
}

