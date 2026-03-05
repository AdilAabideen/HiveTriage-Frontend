import { useCallback, useEffect, useRef, useState } from 'react'
import { triageService } from '../services/triageService'
import { TriageEncounterSummary, TriageQuestion, TriageResponse } from '../types'

const THREAD_STORAGE_KEY = 'triage_thread_id'

export function useTriage(encounterId: string | null, shouldStart: boolean) {
  const hasLoadedRef = useRef(false)
  const [threadId, setThreadId] = useState<string | null>(() => {
    return localStorage.getItem(THREAD_STORAGE_KEY)
  })
  const [question, setQuestion] = useState<TriageQuestion | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isComplete, setIsComplete] = useState(false)
  const [finalFlag, setFinalFlag] = useState<string | null>(null)
  const [encounterSummary, setEncounterSummary] = useState<TriageEncounterSummary | null>(null)

  const handleResponse = useCallback((response: TriageResponse, currentEncounterId: string) => {
    if (response.status === 'completed') {
      setIsComplete(true)
      setFinalFlag(response.final_state?.validation_result?.flag ?? null)
      if (response.thread_id) {
        setThreadId(response.thread_id)
        localStorage.setItem(THREAD_STORAGE_KEY, response.thread_id)
      }
      triageService
        .getEncounterSummary(currentEncounterId)
        .then((summary) => setEncounterSummary(summary))
        .catch(() => setEncounterSummary(null))
      return
    }

    setQuestion(response.question)
    setThreadId(response.thread_id)
    localStorage.setItem(THREAD_STORAGE_KEY, response.thread_id)
  }, [])

  useEffect(() => {
    if (!shouldStart || !encounterId) return
    if (hasLoadedRef.current) return
    hasLoadedRef.current = true

    const loadQuestion = async () => {
      setIsLoading(true)
      setError(null)
      setQuestion(null)

      try {
        const response = await triageService.process({
          encounter_id: encounterId,
          thread_id: threadId,
        })
        handleResponse(response, encounterId)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to start triage')
      } finally {
        setIsLoading(false)
      }
    }

    loadQuestion()
  }, [encounterId, handleResponse, shouldStart, threadId])

  const submitAnswer = useCallback(async (answer: string[]) => {
    if (!threadId) {
      setError('Missing thread id. Please restart the triage flow.')
      return
    }

    setIsLoading(true)
    setError(null)
    setQuestion(null)

    try {
      const response = await triageService.answer({
        thread_id: threadId,
        answer,
      })
      if (encounterId) {
        handleResponse(response, encounterId)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit answer')
    } finally {
      setIsLoading(false)
    }
  }, [encounterId, handleResponse, threadId])

  return {
    threadId,
    question,
    isLoading,
    error,
    isComplete,
    finalFlag,
    encounterSummary,
    submitAnswer,
  }
}
