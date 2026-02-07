import { useQuestions } from '../hooks/useQuestions'
import { QuestionsResponse } from '../types/question'

function Intake() {
  const { data, loading, error } = useQuestions<QuestionsResponse>()

  if (loading) {
    return (
      <div className="min-h-screen bg-nhs flex flex-col items-center justify-center font-['Hind']">
        <p className="text-white text-2xl">Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-nhs flex flex-col items-center justify-center font-['Hind']">
        <p className="text-white text-2xl">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-nhs flex flex-col items-center justify-center font-['Hind']">
      <p className="text-white text-2xl">Questions loaded: {data?.length ?? 0}</p>
    </div>
  )
}

export default Intake
