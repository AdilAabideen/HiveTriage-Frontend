import { useState, useEffect } from 'react'
import { useIntakeFlow } from '../../hooks/useIntakeFlow'
import QuestionCard from './QuestionCard'
import ProgressBar from './ProgressBar'
import { IoWarningOutline as WarningIcon } from "react-icons/io5";
import { IoIosCheckmarkCircleOutline as CheckmarkIcon } from "react-icons/io";
import { BsCheckLg } from "react-icons/bs";
import { ChiefComplaintCategory, OnsetBucket, Trend } from '../../types/question'
import { renderIcon } from '../../utils/iconMap'

function IntakeFlow() {
  const {
    state,
    currentSafetyScreenQuestion,
    registrationProgress,
    safetyScreenProgress,
    answerRegistrationQuestion,
    completeRegistration,
    answerSafetyScreenQuestion,
    // Chief Complaint
    chiefComplaintCategories,
    selectedCategories,
    chiefComplaintSubcategories,
    selectedSubcategoriesByCategory,
    currentSubcategoryGroup,
    currentSubcategoryGroupIndex,
    subcategoryGroupProgress,
    isLastSubcategoryGroup,
    toggleCategory,
    completeCategorySelection,
    toggleSubcategory,
    nextSubcategoryGroup,
    // Category Timing Data
    categoryTimingData,
    setCategoryTiming,
    // Chief Complaint Text
    chiefComplaintText,
    setChiefComplaintText,
    submitChiefComplaintText,
  } = useIntakeFlow()

  const [currentRegistrationIndex, setCurrentRegistrationIndex] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Local state for current category's onset and trend
  const [currentOnset, setCurrentOnset] = useState<OnsetBucket | ''>('')
  const [currentTrend, setCurrentTrend] = useState<Trend | ''>('')

  // Reset local onset/trend when category changes, or load existing values
  useEffect(() => {
    if (currentSubcategoryGroup) {
      const categoryId = currentSubcategoryGroup.category_id
      const existingTiming = categoryTimingData[categoryId]
      setCurrentOnset(existingTiming?.onsetBucket || '')
      setCurrentTrend(existingTiming?.trend || '')
    }
  }, [currentSubcategoryGroup, categoryTimingData])

  // Handle next subcategory group with timing data save
  const handleNextSubcategoryGroup = () => {
    if (currentSubcategoryGroup) {
      // Save timing data for current category using category_id
      setCategoryTiming(currentSubcategoryGroup.category_id, currentOnset, currentTrend)
    }
    nextSubcategoryGroup()
  }

  const handleRegistrationAnswer = (questionId: string, answer: string) => {
    answerRegistrationQuestion(questionId, answer)

    // Move to next question or complete registration phase
    if (currentRegistrationIndex < state.registrationQuestions.length - 1) {
      setCurrentRegistrationIndex(prev => prev + 1)
    } else {
      completeRegistration()
    }
  }

  const handleSafetyScreenAnswer = async (questionId: string, answer: string) => {
    setIsSubmitting(true)
    await answerSafetyScreenQuestion(questionId, answer)
    setIsSubmitting(false)
  }

  // Loading registration questions
  if (state.phase === 'registration_questions' && state.registrationQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-nhs flex flex-col items-center justify-center font-['Hind']">
        <div className="animate-pulse">
          <p className="text-white text-2xl">Loading questions...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (state.error) {
    return (
      <div className="min-h-screen bg-nhs flex flex-col items-center justify-center font-['Hind']">
        <div className="bg-white rounded-2xl p-8 shadow-xl max-w-lg">
          <p className="text-red-600 text-xl text-center">Error: {state.error}</p>
        </div>
      </div>
    )
  }

  // Phase 1: Registration Questions
  if (state.phase === 'registration_questions') {
    const currentQuestion = state.registrationQuestions[currentRegistrationIndex]

    return (
      <div className="min-h-screen bg-nhs flex flex-col items-center justify-center font-['Hind'] p-4 w-full">
        <div className='max-w-[60%] w-full flex flex-col items-center justify-center'>
          <div className="mb-8 w-full">
            <ProgressBar progress={registrationProgress} label="Patient Registration" />
          </div>

          {currentQuestion && (
            <QuestionCard
              question={currentQuestion}
              onAnswer={handleRegistrationAnswer}
              selectedAnswer={state.registrationAnswers[currentQuestion.question_id]}
            />
          )}

          <p className="text-white/70 mt-24">
            Question {currentRegistrationIndex + 1} of {state.registrationQuestions.length}
          </p>
        </div>
      </div>
    )
  }

  // Loading safety screen questions
  if (state.phase === 'loading_questions') {
    return (
      <div className="min-h-screen bg-nhs flex flex-col items-center justify-center font-['Hind']">
        <div className="animate-pulse">
          <p className="text-white text-2xl">Preparing your questions...</p>
        </div>
      </div>
    )
  }

  // Phase 2: Safety Screen Questions
  if (state.phase === 'safety_screen_questions') {
    return (
      <div className="min-h-screen bg-nhs flex flex-col items-center justify-center font-['Hind'] p-4">
        <div className='max-w-[60%] w-full flex flex-col items-center justify-center bg-'>
          <div className="mb-8 w-full  ">
            <ProgressBar progress={safetyScreenProgress} label="Safety Screening" />
          </div>

          {currentSafetyScreenQuestion && (
            <QuestionCard
              question={currentSafetyScreenQuestion}
              onAnswer={handleSafetyScreenAnswer}
              selectedAnswer={state.safetyScreenAnswers[currentSafetyScreenQuestion?.question_id]}

            />
          )}

          <p className="text-white/70 mt-6">
            {isSubmitting ? 'Submitting...' : `Question ${state.currentQuestionIndex + 1} of ${state.safetyScreenQuestions.length}`}
          </p>
        </div>
      </div>
    )
  }

  // Loading Chief Complaint Categories
  if (state.phase === 'chief_complaint_loading_categories') {
    return (
      <div className="min-h-screen bg-nhs flex flex-col items-center justify-center font-['Hind']">
        <div className="animate-pulse">
          <p className="text-white text-2xl">Loading categories...</p>
        </div>
      </div>
    )
  }

  // Phase 3: Chief Complaint Categories
  if (state.phase === 'chief_complaint_categories') {
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
              {chiefComplaintCategories.map((category: ChiefComplaintCategory) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  isSelected={selectedCategories.some(c => c.id === category.id)}
                  onToggle={() => toggleCategory(category.id, category.label)}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end w-full mt-8">
            <button
              onClick={completeCategorySelection}
              disabled={selectedCategories.length === 0}
              className={`
                py-4 px-12 rounded-full text-xl font-medium transition-all duration-200
                ${selectedCategories.length > 0
                  ? 'bg-white text-nhs cursor-pointer hover:bg-gray-100'
                  : 'bg-white/30 text-white/50 cursor-not-allowed'
                }
              `}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Loading Chief Complaint Subcategories
  if (state.phase === 'chief_complaint_loading_subcategories') {
    return (
      <div className="min-h-screen bg-nhs flex flex-col items-center justify-center font-['Hind']">
        <div className="animate-pulse">
          <p className="text-white text-2xl">Loading subcategories...</p>
        </div>
      </div>
    )
  }

  // Phase 4: Chief Complaint Subcategories (one group at a time)
  if (state.phase === 'chief_complaint_subcategories' && currentSubcategoryGroup) {
    return (
      <div className="min-h-screen bg-nhs flex flex-col items-center justify-center font-['Hind'] p-8 w-full">
        <div className="flex flex-col items-start justify-center gap-4 pl-0 w-[80%]">
          <div className="mb-4 w-full">
            {
              chiefComplaintSubcategories.length > 1 && (
                <ProgressBar 
                  progress={subcategoryGroupProgress} 
                  label={`Symptom  ${currentSubcategoryGroupIndex + 1} of ${chiefComplaintSubcategories.length}`} 
                />
              )
            }
          </div>

          <div>
            <p className="text-white text-6xl font-medium text-start">
              {currentSubcategoryGroup.category_name}
            </p>
            <p className="text-white text-3xl font-light italic mb-2 text-start">
              Please Choose Symptoms That Apply
            </p>
          </div>

          <div className="flex flex-col items-center justify-center w-full mt-2">
            <div className="grid grid-cols-3 gap-2 w-full max-h-[40vh] overflow-y-auto p-2">
              {currentSubcategoryGroup.subcategories.map((subcategory: ChiefComplaintCategory) => {
                const categoryId = currentSubcategoryGroup.category_id
                const selectedInCategory = selectedSubcategoriesByCategory[categoryId] || []
                return (
                  <CategoryCard
                    key={subcategory.id}
                    category={subcategory}
                    isSelected={selectedInCategory.includes(subcategory.id)}
                    onToggle={() => toggleSubcategory(categoryId, subcategory.id)}
                  />
                )
              })}
            </div>
          </div>

          {/* Onset & Trend Selects */}
          <div className="flex flex-row gap-6 w-full mt-6">
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-white text-lg font-medium">When did this start?</label>
              <select
                value={currentOnset}
                onChange={(e) => setCurrentOnset(e.target.value as OnsetBucket | '')}
                className="w-full py-3 px-4 rounded-xl text-lg font-normal bg-white text-gray-800 border-2 border-white focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer"
              >
                <option value="">Select...</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="two_to_seven_days">2-7 days ago</option>
                <option value="more_than_one_week">More than 1 week ago</option>
                <option value="not_sure">Not sure</option>
              </select>
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <label className="text-white text-lg font-medium">How is it changing?</label>
              <select
                value={currentTrend}
                onChange={(e) => setCurrentTrend(e.target.value as Trend | '')}
                className="w-full py-3 px-4 rounded-xl text-lg font-normal bg-white text-gray-800 border-2 border-white focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer"
              >
                <option value="">Select...</option>
                <option value="worse">Getting worse</option>
                <option value="same">Staying the same</option>
                <option value="better">Getting better</option>
                <option value="fluctuating">Fluctuating</option>
                <option value="not_sure">Not sure</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end w-full mt-8">
            <button
              onClick={handleNextSubcategoryGroup}
              className="py-4 px-12 rounded-full text-xl font-medium transition-all duration-200 bg-white text-nhs cursor-pointer hover:bg-gray-100"
            >
              {isLastSubcategoryGroup ? 'Next' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Phase 5: Chief Complaint Text Entry
  if (state.phase === 'chief_complaint_text') {
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
            <textarea
              value={chiefComplaintText}
              onChange={(e) => setChiefComplaintText(e.target.value)}
              placeholder="Describe how you're feeling, when symptoms started, what makes it better or worse..."
              className="w-full h-48 p-6 rounded-xl text-lg font-normal bg-white text-gray-800 placeholder-gray-400 border-2 border-white focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
            />
          </div>

          <div className="flex justify-end w-full mt-8">
            <button
              onClick={submitChiefComplaintText}
              className="py-4 px-12 rounded-full text-xl font-medium transition-all duration-200 bg-white text-nhs cursor-pointer hover:bg-gray-100"
            >
              Complete
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Failed Safety Screen
  if (state.phase === 'failed_safety_screen') {
    return (
      <div className="min-h-screen bg-nhs flex flex-col items-center justify-center font-['Hind'] p-4">
        <div className='max-w-[60%] w-full flex flex-col items-start justify-center'>
          <WarningIcon className='text-white text-9xl mb-4' />
          <h2 className="text-7xl font-normal text-white mb-4">Please Wait</h2>
          {state.uiMessage && (
            <p className="text-white text-5xl font-extralight mb-6 text-start">{state.uiMessage}</p>
          )}
          <h2 className="text-5xl font-normal text-white mb-4 mt-6">Your Token is:</h2>
          {state.encounterToken && (
            <h2 className="text-7xl font-normal text-white mb-4">{state.encounterToken}</h2>
          )}
        </div>
      </div>
    )
  }

  // Complete
  if (state.phase === 'complete') {
    return (
      <div className="min-h-screen bg-nhs flex flex-col items-center justify-center font-['Hind'] p-4">
        <div className='max-w-[60%] w-full flex flex-col items-start justify-center'>
          <CheckmarkIcon className='text-white text-9xl mb-4' />
          <h2 className="text-7xl font-normal text-white mb-4">Assessment Complete</h2>
          <p className="text-white text-5xl font-extralight mb-6 text-start">
            Thank you for completing the triage assessment.
          </p>
        </div>
      </div>
    )
  }

  return null
}

// Category Card Component
interface CategoryCardProps {
  category: ChiefComplaintCategory
  isSelected: boolean
  onToggle: () => void
}

function CategoryCard({ category, isSelected, onToggle }: CategoryCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      onClick={onToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        flex flex-col items-start justify-start w-full cursor-pointer
        hover:scale-[1.01] ease-in-out transition-all duration-300 rounded-lg p-4 px-3 relative
        ${isSelected
          ? 'bg-white ring-2 ring-white'
          : isHovered
            ? 'bg-complementary/70'
            : 'bg-complementary/50'
        }
      `}
    >
      <div className="flex flex-row items-center justify-between w-full">
        <div className={`text-lg font-medium text-start ${isSelected ? 'text-nhs' : 'text-black'}`}>
          <div className="flex flex-row items-center justify-center gap-2">
            {renderIcon(category.icon, { className: 'text-4xl' })}
            <p className="text-md font-medium text-start">{category.label}</p>
          </div>
        </div>
        {isSelected && (
          <div className="absolute top-3 right-3 flex items-center justify-center w-6 h-6 bg-nhs rounded-full z-10">
            <BsCheckLg className="text-white text-sm" />
          </div>
        )}
      </div>
      <p className={`text-sm font-light text-start mt-1 ${isSelected ? 'text-nhs/70' : 'text-black/70'}`}>
        {category.description}
      </p>
    </div>
  )
}

export default IntakeFlow
