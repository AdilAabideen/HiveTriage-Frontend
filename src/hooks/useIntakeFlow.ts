/**
 * Main intake flow orchestrator hook
 * Composes useRegistration, useSafetyScreen, and useChiefComplaint
 */

import { useState, useCallback, useEffect } from 'react'
import { useRegistration } from './useRegistration'
import { useSafetyScreen, SafetyScreenResult } from './useSafetyScreen'
import { useChiefComplaint } from './useChiefComplaint'
import { IntakePhase } from '../types'

export function useIntakeFlow() {
  const [phase, setPhase] = useState<IntakePhase>('registration_questions')
  const [uiMessage, setUiMessage] = useState<string | null>(null)
  const [encounterToken, setEncounterToken] = useState<string | null>(null)
  const [globalError] = useState<string | null>(null)

  // Compose child hooks
  const registration = useRegistration()
  const safetyScreen = useSafetyScreen(
    registration.encounterId, 
    phase === 'loading_questions'
  )
  const chiefComplaint = useChiefComplaint(
    registration.encounterId,
    phase === 'chief_complaint_loading_categories'
  )

  // Sync loading state from safety screen
  useEffect(() => {
    if (phase === 'loading_questions' && !safetyScreen.isLoading && safetyScreen.questions.length > 0) {
      setPhase('safety_screen_questions')
    }
  }, [phase, safetyScreen.isLoading, safetyScreen.questions.length])

  // Sync chief complaint phase
  useEffect(() => {
    if (phase === 'chief_complaint_loading_categories' && chiefComplaint.phase === 'categories') {
      setPhase('chief_complaint_categories')
    }
    if (phase === 'chief_complaint_loading_subcategories' && chiefComplaint.phase === 'subcategories') {
      setPhase('chief_complaint_subcategories')
    }
    if (chiefComplaint.phase === 'text_entry' && phase === 'chief_complaint_subcategories') {
      setPhase('chief_complaint_text')
    }
    if (chiefComplaint.phase === 'complete') {
      setPhase('complete')
    }
  }, [phase, chiefComplaint.phase])

  // Aggregate errors
  const error = globalError || registration.error || safetyScreen.error || chiefComplaint.error

  // Registration handlers
  const handleRegistrationAnswer = useCallback((questionId: string, answer: string) => {
    registration.answerQuestion(questionId, answer)
  }, [registration])

  const handleCompleteRegistration = useCallback(async () => {
    setPhase('loading_questions')
    const encId = await registration.submitRegistration()
    if (!encId) {
      setPhase('registration_questions')
    }
  }, [registration])

  // Safety screen handlers
  const handleSafetyScreenAnswer = useCallback(async (questionId: string, answer: string) => {
    const result: SafetyScreenResult | null = await safetyScreen.answerQuestion(questionId, answer)
    
    if (result?.isLastQuestion) {
      if (result.finalAction === 'PROCEED_TO_STAGE_2') {
        setPhase('chief_complaint_loading_categories')
      } else if (result.finalAction === 'SHOW_WAIT_SCREEN') {
        setUiMessage(result.uiMessage)
        setEncounterToken(result.encounterToken)
        setPhase('failed_safety_screen')
      }
    }
  }, [safetyScreen])

  // Chief complaint handlers
  const handleCompleteCategorySelection = useCallback(() => {
    chiefComplaint.completeCategorySelection()
    setPhase('chief_complaint_loading_subcategories')
  }, [chiefComplaint])

  const handleNextSubcategoryGroup = useCallback(() => {
    chiefComplaint.nextSubcategoryGroup()
  }, [chiefComplaint])

  const handleSubmitChiefComplaintText = useCallback(async () => {
    await chiefComplaint.submitChiefComplaint()
  }, [chiefComplaint])

  // Build state object for backward compatibility
  const state = {
    phase,
    currentQuestionIndex: phase === 'registration_questions' 
      ? registration.currentIndex 
      : safetyScreen.currentIndex,
    registrationQuestions: registration.questions,
    registrationAnswers: registration.answers,
    safetyScreenQuestions: safetyScreen.questions,
    safetyScreenAnswers: safetyScreen.answers,
    chiefComplaintCategories: chiefComplaint.categories,
    selectedCategories: chiefComplaint.selectedCategories,
    chiefComplaintSubcategories: chiefComplaint.subcategories,
    selectedSubcategoriesByCategory: chiefComplaint.selectedSubcategoriesByCategory,
    currentSubcategoryGroupIndex: chiefComplaint.currentSubcategoryGroupIndex,
    chiefComplaintText: chiefComplaint.chiefComplaintText,
    categoryTimingData: chiefComplaint.categoryTimingData,
    encounterId: registration.encounterId,
    error,
    uiMessage,
    encounterToken,
  }

  return {
    state,
    encounterId: registration.encounterId,
    // Registration
    currentRegistrationQuestion: registration.currentQuestion,
    registrationProgress: registration.progress,
    answerRegistrationQuestion: handleRegistrationAnswer,
    completeRegistration: handleCompleteRegistration,
    // Safety Screen
    currentSafetyScreenQuestion: safetyScreen.currentQuestion,
    safetyScreenProgress: safetyScreen.progress,
    answerSafetyScreenQuestion: handleSafetyScreenAnswer,
    // Chief Complaint
    chiefComplaintCategories: chiefComplaint.categories,
    selectedCategories: chiefComplaint.selectedCategories,
    chiefComplaintSubcategories: chiefComplaint.subcategories,
    selectedSubcategoriesByCategory: chiefComplaint.selectedSubcategoriesByCategory,
    currentSubcategoryGroup: chiefComplaint.currentSubcategoryGroup,
    currentSubcategoryGroupIndex: chiefComplaint.currentSubcategoryGroupIndex,
    subcategoryGroupProgress: chiefComplaint.subcategoryGroupProgress,
    isLastSubcategoryGroup: chiefComplaint.isLastSubcategoryGroup,
    toggleCategory: chiefComplaint.toggleCategory,
    completeCategorySelection: handleCompleteCategorySelection,

    toggleSubcategory: chiefComplaint.toggleSubcategory,
    nextSubcategoryGroup: handleNextSubcategoryGroup,
    // Timing
    categoryTimingData: chiefComplaint.categoryTimingData,
    setCategoryTiming: chiefComplaint.setCategoryTiming,
    // Chief Complaint Text
    chiefComplaintText: chiefComplaint.chiefComplaintText,
    setChiefComplaintText: chiefComplaint.setChiefComplaintText,
    submitChiefComplaintText: handleSubmitChiefComplaintText,
  }
}
