import { useEffect, useRef, useState } from 'react'
import { triageService } from '../services/triageService'
import { ErrorScreen, LoadingScreen } from '../components/ui'
import TriageQuestionCard from '../components/triage/TriageQuestionCard'
import { TriageEncounterSummary, TriageQuestion, TriageResponse } from '../types'
import { IoIosCheckmarkCircleOutline as CheckmarkIcon } from 'react-icons/io'

const THREAD_STORAGE_KEY = 'triage_thread_id'
const FIXED_ENCOUNTER_ID = '266b8a1e-bee1-4ab1-ad65-f125dc753f0d'

function TriageQA() {
  const hasLoadedRef = useRef(false)
  const [encounterId] = useState<string>(FIXED_ENCOUNTER_ID)
  const [threadId, setThreadId] = useState<string | null>(() => {
    return localStorage.getItem(THREAD_STORAGE_KEY)
  })
  const [question, setQuestion] = useState<TriageQuestion | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isComplete, setIsComplete] = useState(false)
  const [finalFlag, setFinalFlag] = useState<string | null>(null)
  const [encounterSummary, setEncounterSummary] = useState<TriageEncounterSummary | null>(null)

  useEffect(() => {
    if (!encounterId) return
    if (hasLoadedRef.current) return
    hasLoadedRef.current = true

    const loadQuestion = async () => {
      setIsLoading(true)
      setError(null)
      setQuestion(null)

      try {
        console.log('Loading question...')
        console.log('Encounter ID and Thread ID:',{
          encounterId,
          threadId,
        })
        const response = await triageService.process({
          encounter_id: encounterId,
          thread_id: threadId,
        })
        handleResponse(response)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to start triage')
      } finally {
        setIsLoading(false)
      }
    }

    loadQuestion()
  }, [encounterId])

  const handleResponse = (response: TriageResponse) => {
    if (response.status === 'completed') {
      setIsComplete(true)
      setFinalFlag(response.final_state?.validation_result?.flag ?? null)
      if (response.thread_id) {
        setThreadId(response.thread_id)
        localStorage.setItem(THREAD_STORAGE_KEY, response.thread_id)
      }
      if (encounterId) {
        triageService
          .getEncounterSummary(encounterId)
          .then((summary) => {
            setEncounterSummary(summary)
          })
          .catch(() => {
            setEncounterSummary(null)
          })
      }
      return
    }

    setQuestion(response.question)
    setThreadId(response.thread_id)
    localStorage.setItem(THREAD_STORAGE_KEY, response.thread_id)
  }

  const handleSubmitAnswer = async (answer: string[]) => {
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
      handleResponse(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit answer')
    } finally {
      setIsLoading(false)
    }
  }

  if (error) {
    return <ErrorScreen message={error} phase="triage" />
  }

  if (isLoading) {
    return <LoadingScreen message="Loading next question..." />
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-nhs flex flex-col items-center justify-center font-['Hind'] p-4">
        <div className="max-w-[60%] w-full flex flex-col items-start justify-center">
          <CheckmarkIcon className="text-white text-9xl mb-4" />
          <h2 className="text-7xl font-normal text-white mb-4">Assessment Complete</h2>
          <p className="text-white text-5xl font-extralight mb-6 text-start">
            {encounterSummary?.patient_name
              ? `Thank you for completing the assessment ${encounterSummary.patient_name}.`
              : 'Thank you for completing the triage assessment.'}
          </p>
          {encounterSummary?.encounter_token && (
            <p className="text-white text-4xl font-light text-start">
              Your token is {encounterSummary.encounter_token}.
            </p>
          )}
          {!encounterSummary?.encounter_token && finalFlag && (
            <p className="text-white text-4xl font-light text-start">Final flag: {finalFlag}</p>
          )}
        </div>
      </div>
    )
  }

  if (!question) {
    return <LoadingScreen message="Preparing your questions..." />
  }

  return (
    <div className="min-h-screen bg-nhs flex flex-col items-center justify-center font-['Hind'] px-6">
      <div className="max-w-4xl w-full">
        <TriageQuestionCard
          question={question}
          onSubmit={handleSubmitAnswer}
          disabled={isLoading}
        />
      </div>
    </div>
  )
}

export default TriageQA
