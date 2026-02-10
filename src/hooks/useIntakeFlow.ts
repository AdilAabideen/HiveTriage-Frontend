import { useReducer, useEffect, useCallback } from 'react'
import { IntakeState, IntakeAction, Question, SafetyScreenAnswerResponse, ChiefComplaintCategory, CategorySelectionItem, ChiefComplaintSubcategoriesResponse, ChiefComplaintSubcategory, OnsetBucket, Trend } from '../types/question'
import { questionService } from '../services/questionService'

const initialState: IntakeState = {
  phase: 'registration_questions',
  currentQuestionIndex: 0,
  registrationQuestions: [],
  registrationAnswers: {},
  safetyScreenQuestions: [],
  safetyScreenAnswers: {},
  chiefComplaintCategories: [],
  selectedCategories: [],
  chiefComplaintSubcategories: [],
  selectedSubcategoriesByCategory: {},
  currentSubcategoryGroupIndex: 0,
  chiefComplaintText: '',
  categoryTimingData: {},
  encounterId: null,
  error: null,
  uiMessage: null,
  encounterToken: null
}

function intakeReducer(state: IntakeState, action: IntakeAction): IntakeState {
  switch (action.type) {
    case 'SET_REGISTRATION_QUESTIONS':
      return { ...state, registrationQuestions: action.questions, phase: 'registration_questions' }
    
    case 'ANSWER_REGISTRATION':
      return {
        ...state,
        registrationAnswers: { ...state.registrationAnswers, [action.questionId]: action.answer }
      }
    
    case 'COMPLETE_REGISTRATION':
      return { ...state, phase: 'loading_questions', currentQuestionIndex: 0 }
    
    case 'SET_SAFETY_SCREEN_QUESTIONS':
      return { ...state, safetyScreenQuestions: action.questions, phase: 'safety_screen_questions' }
    
    case 'ANSWER_SAFETY_SCREEN':
      return {
        ...state,
        safetyScreenAnswers: { ...state.safetyScreenAnswers, [action.questionId]: action.answer }
      }
    
    case 'NEXT_QUESTION':
      const nextIndex = state.currentQuestionIndex + 1
      return { ...state, currentQuestionIndex: nextIndex }
    
    case 'SET_LOADING':
      return { ...state, phase: 'loading_questions' }
    
    case 'SET_ERROR':
      return { ...state, error: action.error }
    
    case 'SET_COMPLETE':
      return { ...state, phase: 'complete', uiMessage: action.uiMessage, encounterToken: action.encounterToken }
    
    case 'SET_FAILED_SAFETY_SCREEN':
      return { ...state, phase: 'failed_safety_screen', uiMessage: action.uiMessage, encounterToken: action.encounterToken }
    
    case 'SET_ENCOUNTER_ID':
      return { ...state, encounterId: action.encounterId }
    
    // Chief Complaint Actions
    case 'SET_CHIEF_COMPLAINT_LOADING_CATEGORIES':
      return { ...state, phase: 'chief_complaint_loading_categories' }
    
    case 'SET_CHIEF_COMPLAINT_CATEGORIES':
      return { ...state, chiefComplaintCategories: action.categories, phase: 'chief_complaint_categories' }
    
    case 'SELECT_CATEGORY':
      return {
        ...state,
        selectedCategories: state.selectedCategories.some(c => c.id === action.category.id)
          ? state.selectedCategories
          : [...state.selectedCategories, action.category]
      }
    
    case 'DESELECT_CATEGORY':
      return {
        ...state,
        selectedCategories: state.selectedCategories.filter(c => c.id !== action.categoryId)
      }
    
    case 'COMPLETE_CATEGORY_SELECTION':
      return { ...state, phase: 'chief_complaint_loading_subcategories' }
    
    case 'SET_CHIEF_COMPLAINT_LOADING_SUBCATEGORIES':
      return { ...state, phase: 'chief_complaint_loading_subcategories' }
    
    case 'SET_CHIEF_COMPLAINT_SUBCATEGORIES':
      return { ...state, chiefComplaintSubcategories: action.subcategories, phase: 'chief_complaint_subcategories', currentSubcategoryGroupIndex: 0 }
    
    case 'SELECT_SUBCATEGORY': {
      const currentFamilyIds = state.selectedSubcategoriesByCategory[action.categoryId] || []
      if (currentFamilyIds.includes(action.familyId)) {
        return state // Already selected
      }
      return {
        ...state,
        selectedSubcategoriesByCategory: {
          ...state.selectedSubcategoriesByCategory,
          [action.categoryId]: [...currentFamilyIds, action.familyId]
        }
      }
    }
    
    case 'DESELECT_SUBCATEGORY': {
      const currentFamilyIds = state.selectedSubcategoriesByCategory[action.categoryId] || []
      return {
        ...state,
        selectedSubcategoriesByCategory: {
          ...state.selectedSubcategoriesByCategory,
          [action.categoryId]: currentFamilyIds.filter(id => id !== action.familyId)
        }
      }
    }
    
    case 'NEXT_SUBCATEGORY_GROUP':
      return { ...state, currentSubcategoryGroupIndex: state.currentSubcategoryGroupIndex + 1 }
    
    case 'SET_CATEGORY_TIMING':
      return {
        ...state,
        categoryTimingData: {
          ...state.categoryTimingData,
          [action.categoryId]: { onsetBucket: action.onsetBucket, trend: action.trend }
        }
      }
    
    case 'SET_CHIEF_COMPLAINT_TEXT_PHASE':
      return { ...state, phase: 'chief_complaint_text' }
    
    case 'SET_CHIEF_COMPLAINT_TEXT':
      return { ...state, chiefComplaintText: action.text }
    
    case 'COMPLETE_CHIEF_COMPLAINT':
      return { ...state, phase: 'complete' }
    
    default:
      return state
  }
}

export function useIntakeFlow() {
  const [state, dispatch] = useReducer(intakeReducer, initialState)

  // Fetch registration questions on mount
  useEffect(() => {
    const fetchRegistrationQuestions = async () => {
      try {
        const questions: Question[] = await questionService.getRegistrationQuestions()
        dispatch({ type: 'SET_REGISTRATION_QUESTIONS', questions })
      } catch (err) {
        dispatch({ type: 'SET_ERROR', error: err instanceof Error ? err.message : 'Failed to load questions' })
      }
    }
    fetchRegistrationQuestions()
  }, [])

  // Fetch safety screen questions when registration phase completes
  useEffect(() => {
    if (state.phase === 'loading_questions' && Object.keys(state.registrationAnswers).length > 0) {
      const fetchSafetyScreenQuestions = async () => {
        try {
          const registrationResponse = await questionService.submitRegistration(state.registrationAnswers)
          if (registrationResponse?.encounter_id) {
            dispatch({ type: 'SET_ENCOUNTER_ID', encounterId: registrationResponse.encounter_id })
          }
        } catch (err) {
          dispatch({ type: 'SET_ERROR', error: err instanceof Error ? err.message : 'Failed to submit registration' })
          return
        }
        try {
          const questions: Question[] = await questionService.getSafetyScreenQuestions()
          dispatch({ type: 'SET_SAFETY_SCREEN_QUESTIONS', questions })
        } catch (err) {
          console.error(err)
          dispatch({ type: 'SET_ERROR', error: err instanceof Error ? err.message : 'Failed to load questions' })
        }
      }
      fetchSafetyScreenQuestions()
    }
  }, [state.phase, state.registrationAnswers])

  // Fetch chief complaint categories when safety screen completes with PROCEED_TO_STAGE_2
  useEffect(() => {
    if (state.phase === 'chief_complaint_loading_categories') {
      const fetchCategories = async () => {
        try {
          const categories: ChiefComplaintCategory[] = await questionService.getChiefComplaintCategories()
          dispatch({ type: 'SET_CHIEF_COMPLAINT_CATEGORIES', categories })
        } catch (err) {
          dispatch({ type: 'SET_ERROR', error: err instanceof Error ? err.message : 'Failed to load categories' })
        }
      }
      fetchCategories()
    }
  }, [state.phase])

  // Fetch chief complaint subcategories when categories are selected
  useEffect(() => {
    if (state.phase === 'chief_complaint_loading_subcategories' && state.selectedCategories.length > 0) {
      const fetchSubcategories = async () => {
        try {
          const response: ChiefComplaintSubcategoriesResponse = await questionService.getChiefComplaintSubcategories(
            { categories: state.selectedCategories }
          )
          const subcategories: ChiefComplaintSubcategory[] = response.subcategories
          dispatch({ type: 'SET_CHIEF_COMPLAINT_SUBCATEGORIES', subcategories })
        } catch (err) {
          dispatch({ type: 'SET_ERROR', error: err instanceof Error ? err.message : 'Failed to load subcategories' })
        }
      }
      fetchSubcategories()
    }
  }, [state.phase, state.selectedCategories])

  const answerRegistrationQuestion = useCallback((questionId: string, answer: string) => {
    dispatch({ type: 'ANSWER_REGISTRATION', questionId, answer })
  }, [])

  const completeRegistration = useCallback(() => {
    dispatch({ type: 'COMPLETE_REGISTRATION' })
  }, [state.registrationAnswers])

  const answerSafetyScreenQuestion = useCallback(async (questionId: string, answer: string) => {
    if (!state.encounterId) {
      dispatch({ type: 'SET_ERROR', error: 'No encounter ID available' })
      return
    }
    
    try {
      // Submit answer to API
      const response: SafetyScreenAnswerResponse = await questionService.submitSafetyScreenAnswer(
        questionId, 
        answer, 
        state.encounterId
      )

      // Update local state
      dispatch({ type: 'ANSWER_SAFETY_SCREEN', questionId, answer })

      // Check if this is the last question
      if (response.is_last_question) {
        if (response.final_action === 'PROCEED_TO_STAGE_2') {
          // Go to chief complaint flow instead of complete
          dispatch({ type: 'SET_CHIEF_COMPLAINT_LOADING_CATEGORIES' })
        } else if (response.final_action === 'SHOW_WAIT_SCREEN') {
          dispatch({ type: 'SET_FAILED_SAFETY_SCREEN', uiMessage: response.ui_message, encounterToken: response.encounter_token })
        }
      } else {
        dispatch({ type: 'NEXT_QUESTION' })
      }
    } catch (err) {
      dispatch({ type: 'SET_ERROR', error: err instanceof Error ? err.message : 'Failed to submit answer' })
    }
  }, [state.encounterId])

  // Chief Complaint Actions
  const selectCategory = useCallback((category: CategorySelectionItem) => {
    dispatch({ type: 'SELECT_CATEGORY', category })
  }, [])

  const deselectCategory = useCallback((categoryId: string) => {
    dispatch({ type: 'DESELECT_CATEGORY', categoryId })
  }, [])

  const toggleCategory = useCallback((id: string, name: string) => {
    if (state.selectedCategories.some(c => c.id === id)) {
      dispatch({ type: 'DESELECT_CATEGORY', categoryId: id })
    } else {
      dispatch({ type: 'SELECT_CATEGORY', category: { id, name } })
    }
  }, [state.selectedCategories])

  const completeCategorySelection = useCallback(() => {
    if (state.selectedCategories.length > 0) {
      dispatch({ type: 'COMPLETE_CATEGORY_SELECTION' })
    }
  }, [state.selectedCategories])

  const selectSubcategory = useCallback((categoryId: string, familyId: string) => {
    dispatch({ type: 'SELECT_SUBCATEGORY', categoryId, familyId })
  }, [])

  const deselectSubcategory = useCallback((categoryId: string, familyId: string) => {
    dispatch({ type: 'DESELECT_SUBCATEGORY', categoryId, familyId })
  }, [])

  const toggleSubcategory = useCallback((categoryId: string, familyId: string) => {
    const currentFamilyIds = state.selectedSubcategoriesByCategory[categoryId] || []
    if (currentFamilyIds.includes(familyId)) {
      dispatch({ type: 'DESELECT_SUBCATEGORY', categoryId, familyId })
    } else {
      dispatch({ type: 'SELECT_SUBCATEGORY', categoryId, familyId })
    }
  }, [state.selectedSubcategoriesByCategory])

  const nextSubcategoryGroup = useCallback(() => {
    const isLastGroup = state.currentSubcategoryGroupIndex >= state.chiefComplaintSubcategories.length - 1
    if (isLastGroup) {
      // Go to text entry phase instead of complete
      dispatch({ type: 'SET_CHIEF_COMPLAINT_TEXT_PHASE' })
    } else {
      dispatch({ type: 'NEXT_SUBCATEGORY_GROUP' })
    }
  }, [state.currentSubcategoryGroupIndex, state.chiefComplaintSubcategories.length])

  const setCategoryTiming = useCallback((categoryId: string, onsetBucket: OnsetBucket | '', trend: Trend | '') => {
    dispatch({ type: 'SET_CATEGORY_TIMING', categoryId, onsetBucket, trend })
  }, [])

  const setChiefComplaintText = useCallback((text: string) => {
    dispatch({ type: 'SET_CHIEF_COMPLAINT_TEXT', text })
  }, [])

  const submitChiefComplaintText = useCallback(async () => {
    try {
      // Build selections array from categoryTimingData and selectedSubcategoriesByCategory
      const selections = Object.keys(state.categoryTimingData).map(categoryId => ({
        category_id: categoryId,
        onset_bucket: state.categoryTimingData[categoryId].onsetBucket,
        trend: state.categoryTimingData[categoryId].trend,
        family_ids: state.selectedSubcategoriesByCategory[categoryId] || []
      }))

      await questionService.submitChiefComplaint({
        encounter_id: state.encounterId || null,
        selections,
        overall_text: state.chiefComplaintText
      })
      dispatch({ type: 'COMPLETE_CHIEF_COMPLAINT' })
    } catch (err) {
      dispatch({ type: 'SET_ERROR', error: err instanceof Error ? err.message : 'Failed to submit chief complaint' })
    }
  }, [state.categoryTimingData, state.selectedSubcategoriesByCategory, state.chiefComplaintText, state.encounterId])

  const currentRegistrationQuestion = state.registrationQuestions[state.currentQuestionIndex]
  const currentSafetyScreenQuestion = state.safetyScreenQuestions[state.currentQuestionIndex]
  const currentSubcategoryGroup = state.chiefComplaintSubcategories[state.currentSubcategoryGroupIndex]

  const registrationProgress = state.registrationQuestions.length > 0 
    ? Object.keys(state.registrationAnswers).length / state.registrationQuestions.length 
    : 0

  const safetyScreenProgress = state.safetyScreenQuestions.length > 0 
    ? (state.currentQuestionIndex) / state.safetyScreenQuestions.length 
    : 0

  const subcategoryGroupProgress = state.chiefComplaintSubcategories.length > 0
    ? state.currentSubcategoryGroupIndex / state.chiefComplaintSubcategories.length
    : 0

  const isLastSubcategoryGroup = state.currentSubcategoryGroupIndex >= state.chiefComplaintSubcategories.length - 1

  return {
    state,
    encounterId: state.encounterId,
    currentRegistrationQuestion,
    currentSafetyScreenQuestion,
    registrationProgress,
    safetyScreenProgress,
    answerRegistrationQuestion,
    completeRegistration,
    answerSafetyScreenQuestion,
    // Chief Complaint exports
    chiefComplaintCategories: state.chiefComplaintCategories,
    selectedCategories: state.selectedCategories,
    chiefComplaintSubcategories: state.chiefComplaintSubcategories,
    selectedSubcategoriesByCategory: state.selectedSubcategoriesByCategory,
    currentSubcategoryGroup,
    currentSubcategoryGroupIndex: state.currentSubcategoryGroupIndex,
    subcategoryGroupProgress,
    isLastSubcategoryGroup,
    selectCategory,
    deselectCategory,
    toggleCategory,
    completeCategorySelection,
    selectSubcategory,
    deselectSubcategory,
    toggleSubcategory,
    nextSubcategoryGroup,
    // Category Timing Data
    categoryTimingData: state.categoryTimingData,
    setCategoryTiming,
    // Chief Complaint Text
    chiefComplaintText: state.chiefComplaintText,
    setChiefComplaintText,
    submitChiefComplaintText
  }
}
