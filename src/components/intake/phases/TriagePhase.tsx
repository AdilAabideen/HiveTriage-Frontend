/**
 * Triage Question Phase (embedded in intake flow)
 */

import { IoIosCheckmarkCircleOutline as CheckmarkIcon } from 'react-icons/io'
import { ErrorScreen, LoadingScreen } from '../../ui'
import TriageQuestionCard from '../../triage/TriageQuestionCard'
import { TriageEncounterSummary, TriageQuestion } from '../../../types'

interface TriagePhaseProps {
  question: TriageQuestion | null
  isLoading: boolean
  error: string | null
  isComplete: boolean
  finalFlag: string | null
  encounterSummary: TriageEncounterSummary | null
  onSubmitAnswer: (answer: string[]) => void
}

export function TriagePhase({
  question,
  isLoading,
  error,
  isComplete,
  finalFlag,
  encounterSummary,
  onSubmitAnswer,
}: TriagePhaseProps) {
  if (error) {
    return <ErrorScreen message={error} phase="triage" />
  }

  if (isLoading && !question) {
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
          onSubmit={onSubmitAnswer}
          disabled={isLoading}
        />
      </div>
    </div>
  )
}

export default TriagePhase
