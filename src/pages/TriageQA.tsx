import { useSearchParams } from 'react-router-dom'
import { ErrorScreen } from '../components/ui'
import { useTriage } from '../hooks/useTriage'
import { TriagePhase } from '../components/intake/phases'

function TriageQA() {
  const [searchParams] = useSearchParams()
  const encounterId = searchParams.get('encounter_id')
  const triage = useTriage(encounterId, true)

  if (!encounterId) {
    return <ErrorScreen message="Missing encounter id. Add ?encounter_id=... to the URL." phase="triage" />
  }

  return (
    <TriagePhase
      question={triage.question}
      isLoading={triage.isLoading}
      error={triage.error}
      isComplete={triage.isComplete}
      finalFlag={triage.finalFlag}
      encounterSummary={triage.encounterSummary}
      onSubmitAnswer={triage.submitAnswer}
    />
  )
}

export default TriageQA
