/**
 * Chief Complaint Text Entry Phase
 */

import { Button, TextArea } from '../../ui'

export interface TextEntryPhaseProps {
  text: string
  onTextChange: (text: string) => void
  onSubmit: () => void
}

export function TextEntryPhase({
  text,
  onTextChange,
  onSubmit,
}: TextEntryPhaseProps) {
  return (
    <div className="min-h-screen bg-nhs flex flex-col items-center justify-center font-['Hind'] p-8 w-full">
      <div className="flex flex-col items-start justify-center gap-4 pl-0 w-[80%]">
        <div>
          <p className="text-white text-6xl font-medium text-start">
            Additional Information
          </p>
          <p className="text-white text-3xl font-light italic mb-2 text-start">
            Please describe your symptoms in your own words
          </p>
        </div>

        <div className="w-full mt-4">
          <TextArea
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder="Describe how you're feeling, when symptoms started, what makes it better or worse..."
          />
        </div>

        <div className="flex justify-end w-full mt-8">
          <Button onClick={onSubmit} variant="primary" size="lg">
            Complete
          </Button>
        </div>
      </div>
    </div>
  )
}

export default TextEntryPhase

