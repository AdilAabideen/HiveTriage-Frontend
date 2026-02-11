/**
 * Failed Safety Screen Phase
 */

import { IoWarningOutline as WarningIcon } from 'react-icons/io5'

export interface FailedPhaseProps {
  uiMessage: string | null
  encounterToken: string | null
}

export function FailedPhase({ uiMessage, encounterToken }: FailedPhaseProps) {
  return (
    <div className="min-h-screen bg-nhs flex flex-col items-center justify-center font-['Hind'] p-4">
      <div className="max-w-[60%] w-full flex flex-col items-start justify-center">
        <WarningIcon className="text-white text-9xl mb-4" />
        <h2 className="text-7xl font-normal text-white mb-4">Please Wait</h2>
        {uiMessage && (
          <p className="text-white text-5xl font-extralight mb-6 text-start">{uiMessage}</p>
        )}
        <h2 className="text-5xl font-normal text-white mb-4 mt-6">Your Token is:</h2>
        {encounterToken && (
          <h2 className="text-7xl font-normal text-white mb-4">{encounterToken}</h2>
        )}
      </div>
    </div>
  )
}

export default FailedPhase

