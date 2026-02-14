/**
 * Chief Complaint Presentations Selection Phase
 */

import { ChiefComplaintPresentation, ChiefComplaintPresentationsData, CardItem } from '../../../types'
import CategoryCard from '../CategoryCard'
import ProgressBar from '../ProgressBar'
import { Button } from '../../ui'

export interface PresentationsPhaseProps {
  presentations: ChiefComplaintPresentation[]
  currentGroup: ChiefComplaintPresentation
  currentGroupIndex: number
  selectedByCategory: Record<string, string[]>
  progress: number
  onTogglePresentation: (categoryId: string, presentationId: string) => void
  onNext: () => void
}

export function PresentationsPhase({
  presentations,
  currentGroup,
  currentGroupIndex,
  selectedByCategory,
  progress,
  onTogglePresentation,
  onNext,
}: PresentationsPhaseProps) {
  const categoryId = currentGroup.category_id
  const selectedInCategory = selectedByCategory[categoryId] || []

  return (
    <div className="min-h-screen bg-nhs flex flex-col items-center justify-center font-['Hind'] p-8 w-full">
      <div className="flex flex-col items-start justify-center gap-4 pl-0 w-[80%]">
        {presentations.length > 1 && (
          <div className="mb-4 w-full">
            <ProgressBar 
              progress={progress} 
              label={`Symptom ${currentGroupIndex + 1} of ${presentations.length}`} 
            />
          </div>
        )}

        <div>
          <p className="text-white text-6xl font-medium text-start">
            {currentGroup.category_name}
          </p>
          <p className="text-white text-3xl font-light italic mb-2 text-start">
            Please Choose Symptoms That Apply
          </p>
        </div>

        <div className="flex flex-col items-center justify-center w-full mt-2">
          <div className="grid grid-cols-3 gap-2 w-full max-h-[40vh] overflow-y-auto p-2">
            {currentGroup.presentations.map((presentation: ChiefComplaintPresentationsData) => (
              <CategoryCard
                key={presentation.id}
                category={
                  {
                    id: presentation.id,
                    label: presentation.label,
                    description: presentation.patient_explanation,
                    icon: presentation.icon,
                  } as CardItem
                }
                isSelected={selectedInCategory.includes(presentation.id)}
                onToggle={() => onTogglePresentation(categoryId, presentation.id)}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end w-full mt-8">
          <Button onClick={onNext} variant="primary" size="lg">
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PresentationsPhase

