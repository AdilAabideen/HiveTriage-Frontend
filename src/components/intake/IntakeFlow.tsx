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
  PresentationsPhase,
  PresentationTimingsPhase,
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
    chiefComplaintPresentations,
    selectedPresentationsByCategory,
    currentPresentationGroup,
    currentPresentationGroupIndex,
    presentationGroupProgress,
    selectedPresentationsDetailed,
    presentationTimingById,
    toggleCategory,
    completeCategorySelection,
    togglePresentation,
    nextPresentationGroup,
    setPresentationTiming,
    completeTimings,
    // Chief Complaint Text
    chiefComplaintText,
    setChiefComplaintText,
    submitChiefComplaintText,
  } = useIntakeFlow()

  // Error state
  if (state.error) {
    return <ErrorScreen message={state.error} phase={state.phase} />
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

  // Loading Chief Complaint Presentations
  if (state.phase === 'chief_complaint_loading_presentations') {
    return <LoadingScreen message="Loading presentations..." />
  }

  // Phase 4: Chief Complaint Presentations
  if (state.phase === 'chief_complaint_presentations' && currentPresentationGroup) {
    return (
      <PresentationsPhase
        presentations={chiefComplaintPresentations}
        currentGroup={currentPresentationGroup}
        currentGroupIndex={currentPresentationGroupIndex}
        selectedByCategory={selectedPresentationsByCategory}
        progress={presentationGroupProgress}
        onTogglePresentation={togglePresentation}
        onNext={nextPresentationGroup}
      />
    )
  }

  // Phase 5: Presentation Timings (onset & trend per presentation)
  if (state.phase === 'chief_complaint_presentations_details') {
    return (
      <PresentationTimingsPhase
        presentations={selectedPresentationsDetailed}
        timings={presentationTimingById}
        onChangeTiming={setPresentationTiming}
        onComplete={completeTimings}
      />
    )
  }

  // Phase 6: Chief Complaint Text Entry
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
