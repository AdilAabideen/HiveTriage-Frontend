import { useNavigate } from 'react-router-dom'

function Welcome() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-nhs flex flex-col items-center justify-center font-['Hind']">
      <h1 className="text-7xl font-normal text-white ">Welcome to Hive Triage</h1>
      <p className="text-3xl font-light text-white mt-4">Answer following questions to consult a doctor</p>
      <button 
        onClick={() => navigate('/intake')}
        className="cursor-pointer bg-white text-nhs px-8 py-4 rounded-full text-2xl font-normal mt-12 animate-bounce-slow hover:[animation-play-state:paused]"
      >
        Start
      </button>
    </div>
  )
}

export default Welcome

