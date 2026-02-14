/**
 * Presentation Timings Phase - onset & trend per selected presentation
 * Shows ONE presentation at a time, with Next to move through all.
 */

import { useState } from 'react'
import { OnsetBucket, Trend } from '../../../types'
import ProgressBar from '../ProgressBar'
import { Select } from '../../ui'

interface TimingItem {
  id: string
  label: string
  description: string
  categoryName: string
}

export interface PresentationTimingsPhaseProps {
  presentations: TimingItem[]
  timings: Record<string, { onset_bucket: OnsetBucket | ''; trend: Trend | '' }>
  onChangeTiming: (presentationId: string, onset: OnsetBucket | '', trend: Trend | '') => void
  onComplete: () => void
}

const onsetOptions: { value: OnsetBucket; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'two_to_seven_days', label: '2-7 days ago' },
  { value: 'more_than_one_week', label: 'More than 1 week ago' },
  { value: 'not_sure', label: 'Not sure' },
]

const trendOptions: { value: Trend; label: string }[] = [
  { value: 'worse', label: 'Getting worse' },
  { value: 'same', label: 'Staying the same' },
  { value: 'better', label: 'Getting better' },
  { value: 'fluctuating', label: 'Fluctuating' },
  { value: 'not_sure', label: 'Not sure' },
]

export function PresentationTimingsPhase({
  presentations,
  timings,
  onChangeTiming,
  onComplete,
}: PresentationTimingsPhaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const total = presentations.length
  const completed = presentations.filter(p => {
    const t = timings[p.id]
    return t && t.onset_bucket && t.trend
  }).length

  const progress = total > 0 ? completed / total : 0
  const current = presentations[currentIndex]
  const currentTiming =
    (current && timings[current.id]) || ({ onset_bucket: '', trend: '' } as {
      onset_bucket: OnsetBucket | ''
      trend: Trend | ''
    })

  const isLast = currentIndex >= total - 1
  const currentFilled = !!(currentTiming.onset_bucket && currentTiming.trend)

  const handleNext = () => {
    if (!currentFilled || !current) return
    if (isLast) {
      onComplete()
    } else {
      setCurrentIndex(prev => prev + 1)
    }
  }

  // If no presentations, just skip this phase
  if (total === 0 || !current) {
    onComplete()
    return null
  }

  return (
    <div className="min-h-screen bg-nhs flex flex-col items-center justify-center font-['Hind'] p-8 w-full">
      <div className="flex flex-col items-start justify-center gap-4 pl-0 w-[80%]">
        {total > 0 && (
          <div className="mb-4 w-full">
            <ProgressBar
              progress={progress}
              label={`Symptom Details (${completed} of ${total} completed)`}
            />
          </div>
        )}

        <div>
          <p className="text-white text-6xl font-medium text-start">Symptom Details</p>
          <p className="text-white text-3xl font-light italic mb-2 text-start">
            For each symptom, tell us when it started and how it is changing
          </p>
        </div>

        <div className="flex flex-col items-center justify-center w-full mt-4 gap-4 max-h-[50vh] overflow-y-auto pr-2">
          <div className="w-full bg-complementary/40 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex flex-col">
              <span className="text-white text-lg font-medium">{current.label}</span>
              <span className="text-white/70 text-sm">{current.categoryName}</span>
              {current.description && (
                <span className="text-white/80 text-sm mt-1">{current.description}</span>
              )}
            </div>

            <div className="flex flex-row gap-4 w-full mt-2">
              <Select<OnsetBucket>
                label="When did this start?"
                options={onsetOptions}
                value={currentTiming.onset_bucket}
                onChange={value =>
                  onChangeTiming(
                    current.id,
                    (value as OnsetBucket) || '',
                    currentTiming.trend
                  )
                }
              />
              <Select<Trend>
                label="How is it changing?"
                options={trendOptions}
                value={currentTiming.trend}
                onChange={value =>
                  onChangeTiming(
                    current.id,
                    currentTiming.onset_bucket,
                    (value as Trend) || ''
                  )
                }
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end w-full mt-8">
          <button
            onClick={handleNext}
            disabled={!currentFilled}
            className={`py-4 px-12 rounded-full text-xl font-medium transition-all duration-200
              ${
                currentFilled
                  ? 'bg-white text-nhs cursor-pointer hover:bg-gray-100'
                  : 'bg-white/30 text-white/50 cursor-not-allowed'
              }`}
          >
            {isLast ? 'Next' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PresentationTimingsPhase


