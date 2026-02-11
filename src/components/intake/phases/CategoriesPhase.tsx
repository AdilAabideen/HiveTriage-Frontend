/**
 * Chief Complaint Categories Selection Phase
 */

import { ChiefComplaintCategory, CategorySelectionItem } from '../../../types'
import CategoryCard from '../CategoryCard'
import { Button } from '../../ui'

export interface CategoriesPhaseProps {
  categories: ChiefComplaintCategory[]
  selectedCategories: CategorySelectionItem[]
  onToggle: (id: string, name: string) => void
  onComplete: () => void
}

export function CategoriesPhase({
  categories,
  selectedCategories,
  onToggle,
  onComplete,
}: CategoriesPhaseProps) {
  return (
    <div className="min-h-screen bg-nhs flex flex-col items-center justify-center font-['Hind'] p-8 w-full">
      <div className="flex flex-col items-start justify-center gap-4 pl-0 w-[80%]">
        <div>
          <p className="text-white text-6xl font-medium text-start">
            Chief Complaint
          </p>
          <p className="text-white text-3xl font-light italic mb-2 text-start">
            Please Choose Categories That Apply
          </p>
        </div>

        <div className="flex flex-col items-center justify-center w-full mt-2">
          <div className="grid grid-cols-3 gap-4 p-2 w-full max-h-[50vh] overflow-y-auto">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                isSelected={selectedCategories.some(c => c.id === category.id)}
                onToggle={() => onToggle(category.id, category.label)}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end w-full mt-8">
          <Button
            onClick={onComplete}
            disabled={selectedCategories.length === 0}
            variant="primary"
            size="lg"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CategoriesPhase

