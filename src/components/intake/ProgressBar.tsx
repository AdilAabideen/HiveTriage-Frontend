interface ProgressBarProps {
  progress: number
  label?: string
}

function ProgressBar({ progress, label }: ProgressBarProps) {
  const percentage = Math.round(progress * 100)
  
  return (
    <div className="  w-full">
      {label && (
        <p className="text-white text-xl font-light mb-2">{label}</p>
      )}
      <div className="w-full bg-white/30 rounded-full h-2">
        <div 
          className="bg-white h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-white/70 text-sm mt-1 text-right">{percentage}%</p>
    </div>
  )
}

export default ProgressBar

