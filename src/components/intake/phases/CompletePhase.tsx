/**
 * Assessment Complete Phase
 */

import { IoIosCheckmarkCircleOutline as CheckmarkIcon } from 'react-icons/io'

export function CompletePhase() {
  return (
    <div className="min-h-screen bg-nhs flex flex-col items-center justify-center font-['Hind'] p-4">
      <div className="max-w-[60%] w-full flex flex-col items-start justify-center">
        <CheckmarkIcon className="text-white text-9xl mb-4" />
        <h2 className="text-7xl font-normal text-white mb-4">Assessment Complete</h2>
        <p className="text-white text-5xl font-extralight mb-6 text-start">
          Thank you for completing the triage assessment.
        </p>
      </div>
    </div>
  )
}

export default CompletePhase

