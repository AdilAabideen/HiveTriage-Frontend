/**
 * Chief Complaint Subcategories Selection Phase
 */

import { useState, useEffect } from 'react'
import { ChiefComplaintSubcategory, ChiefComplaintCategory, OnsetBucket, Trend } from '../../../types'
import CategoryCard from '../CategoryCard'
import ProgressBar from '../ProgressBar'
import { Button, Select, SelectOption } from '../../ui'

const onsetOptions: SelectOption<OnsetBucket>[] = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'two_to_seven_days', label: '2-7 days ago' },
  { value: 'more_than_one_week', label: 'More than 1 week ago' },
  { value: 'not_sure', label: 'Not sure' },
]

const trendOptions: SelectOption<Trend>[] = [
  { value: 'worse', label: 'Getting worse' },
  { value: 'same', label: 'Staying the same' },
  { value: 'better', label: 'Getting better' },
  { value: 'fluctuating', label: 'Fluctuating' },
  { value: 'not_sure', label: 'Not sure' },
]

export interface SubcategoriesPhaseProps {
  subcategories: ChiefComplaintSubcategory[]
  currentGroup: ChiefComplaintSubcategory
  currentGroupIndex: number
  selectedByCategory: Record<string, string[]>
  categoryTimingData: Record<string, { onsetBucket: OnsetBucket | ''; trend: Trend | '' }>
  progress: number
  isLastGroup: boolean
  onToggleSubcategory: (categoryId: string, familyId: string) => void
  onSetTiming: (categoryId: string, onsetBucket: OnsetBucket | '', trend: Trend | '') => void
  onNext: () => void
}

export function SubcategoriesPhase({
  subcategories,
  currentGroup,
  currentGroupIndex,
  selectedByCategory,
  categoryTimingData,
  progress,
  onToggleSubcategory,
  onSetTiming,
  onNext,
}: SubcategoriesPhaseProps) {
  const [currentOnset, setCurrentOnset] = useState<OnsetBucket | ''>('')
  const [currentTrend, setCurrentTrend] = useState<Trend | ''>('')

  // Reset local onset/trend when category changes, or load existing values
  useEffect(() => {
    if (currentGroup) {
      const categoryId = currentGroup.category_id
      const existingTiming = categoryTimingData[categoryId]
      setCurrentOnset(existingTiming?.onsetBucket || '')
      setCurrentTrend(existingTiming?.trend || '')
    }
  }, [currentGroup, categoryTimingData])

  const handleNext = () => {
    if (currentGroup) {
      onSetTiming(currentGroup.category_id, currentOnset, currentTrend)
    }
    onNext()
  }

  const categoryId = currentGroup.category_id
  const selectedInCategory = selectedByCategory[categoryId] || []

  return (
    <div className="min-h-screen bg-nhs flex flex-col items-center justify-center font-['Hind'] p-8 w-full">
      <div className="flex flex-col items-start justify-center gap-4 pl-0 w-[80%]">
        {subcategories.length > 1 && (
          <div className="mb-4 w-full">
            <ProgressBar 
              progress={progress} 
              label={`Symptom ${currentGroupIndex + 1} of ${subcategories.length}`} 
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
            {currentGroup.subcategories.map((subcategory: ChiefComplaintCategory) => (
              <CategoryCard
                key={subcategory.id}
                category={subcategory}
                isSelected={selectedInCategory.includes(subcategory.id)}
                onToggle={() => onToggleSubcategory(categoryId, subcategory.id)}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-row gap-6 w-full mt-6">
          <Select<OnsetBucket>
            label="When did this start?"
            options={onsetOptions}
            value={currentOnset}
            onChange={setCurrentOnset}
          />
          <Select<Trend>
            label="How is it changing?"
            options={trendOptions}
            value={currentTrend}
            onChange={setCurrentTrend}
          />
        </div>

        <div className="flex justify-end w-full mt-8">
          <Button onClick={handleNext} variant="primary" size="lg">
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SubcategoriesPhase

