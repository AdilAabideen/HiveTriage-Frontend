export interface ErrorScreenProps {
  message: string
  phase: string
}

export function ErrorScreen({ message, phase }: ErrorScreenProps) {
  return (
    <div className="min-h-screen bg-nhs flex flex-col items-center justify-center font-['Hind']">
      <div className="bg-white rounded-2xl p-8 shadow-xl max-w-lg">
        <p className="text-red-600 text-xl text-center">Error: {message}</p>
        <p className="text-red-600 text-xl text-center">Phase: {phase}</p>
      </div>
    </div>
  )
}

export default ErrorScreen

