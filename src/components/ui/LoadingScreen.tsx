export interface LoadingScreenProps {
  message?: string
}

export function LoadingScreen({ message = 'Loading...' }: LoadingScreenProps) {
  return (
    <div className="min-h-screen bg-nhs flex flex-col items-center justify-center font-['Hind']">
      <div className="animate-pulse">
        <p className="text-white text-2xl">{message}</p>
      </div>
    </div>
  )
}

export default LoadingScreen

