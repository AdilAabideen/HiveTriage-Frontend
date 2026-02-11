/**
 * Main Intake Flow Component - Phase Router
 * Routes to the appropriate phase component based on current state
 */

import { useIntakeFlow } from '../../hooks/useIntakeFlow'
import { LoadingScreen, ErrorScreen } from '../ui'
import {
  RegistrationPhase,
  SafetyScreenPhase,
  CategoriesPhase,
  SubcategoriesPhase,
  TextEntryPhase,
  CompletePhase,
  FailedPhase,
} from './phases'

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

  // Error state
  if (state.error) {
    return <ErrorScreen message={state.error} />
  }

  // Loading registration questions
  if (state.phase === 'registration_questions' && state.registrationQuestions.length === 0) {
    return <LoadingScreen message="Loading questions..." />
  }

  // Phase 1: Registration Questions
  if (state.phase === 'registration_questions') {
    return (
      <RegistrationPhase
        questions={state.registrationQuestions}
        answers={state.registrationAnswers}
        progress={registrationProgress}
        onAnswer={answerRegistrationQuestion}
        onComplete={completeRegistration}
      />
    )
  }

  // Loading safety screen questions
  if (state.phase === 'loading_questions') {
    return <LoadingScreen message="Preparing your questions..." />
  }

  // Phase 2: Safety Screen Questions
  if (state.phase === 'safety_screen_questions') {
    return (
      <SafetyScreenPhase
        currentQuestion={currentSafetyScreenQuestion}
        currentIndex={state.currentQuestionIndex}
        totalQuestions={state.safetyScreenQuestions.length}
        answers={state.safetyScreenAnswers}
        progress={safetyScreenProgress}
        onAnswer={answerSafetyScreenQuestion}
      />
    )
  }

  // Loading Chief Complaint Categories
  if (state.phase === 'chief_complaint_loading_categories') {
    return <LoadingScreen message="Loading categories..." />
  }

  // Phase 3: Chief Complaint Categories
  if (state.phase === 'chief_complaint_categories') {
    return (
      <CategoriesPhase
        categories={chiefComplaintCategories}
        selectedCategories={selectedCategories}
        onToggle={toggleCategory}
        onComplete={completeCategorySelection}
      />
    )
  }

  // Loading Chief Complaint Subcategories
  if (state.phase === 'chief_complaint_loading_subcategories') {
    return <LoadingScreen message="Loading subcategories..." />
  }

  // Phase 4: Chief Complaint Subcategories
  if (state.phase === 'chief_complaint_subcategories' && currentSubcategoryGroup) {
    return (
      <SubcategoriesPhase
        subcategories={chiefComplaintSubcategories}
        currentGroup={currentSubcategoryGroup}
        currentGroupIndex={currentSubcategoryGroupIndex}
        selectedByCategory={selectedSubcategoriesByCategory}
        categoryTimingData={categoryTimingData}
        progress={subcategoryGroupProgress}
        isLastGroup={isLastSubcategoryGroup}
        onToggleSubcategory={toggleSubcategory}
        onSetTiming={setCategoryTiming}
        onNext={nextSubcategoryGroup}
      />
    )
  }

  // Phase 5: Chief Complaint Text Entry
  if (state.phase === 'chief_complaint_text') {
    return (
      <TextEntryPhase
        text={chiefComplaintText}
        onTextChange={setChiefComplaintText}
        onSubmit={submitChiefComplaintText}
      />
    )
  }

  // Failed Safety Screen
  if (state.phase === 'failed_safety_screen') {
    return (
      <FailedPhase
        uiMessage={state.uiMessage}
        encounterToken={state.encounterToken}
      />
    )
  }

  // Complete
  if (state.phase === 'complete') {
    return <CompletePhase />
  }

  return null
}

export default IntakeFlow
