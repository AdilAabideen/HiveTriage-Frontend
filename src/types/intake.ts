/**
 * Intake Flow state management types
 */

import { Question } from './registration'
import { 
  ChiefComplaintCategory, 
  ChiefComplaintSubcategory, 
  CategorySelectionItem,
  OnsetBucket,
  Trend
} from './chiefComplaint'

export type IntakePhase = 
  | 'registration_questions'
  | 'loading_questions'
  | 'safety_screen_questions'
  | 'chief_complaint_loading_categories'
  | 'chief_complaint_categories'
  | 'chief_complaint_loading_subcategories'
  | 'chief_complaint_subcategories'
  | 'chief_complaint_text'
  | 'submitting'
  | 'complete'
  | 'failed_safety_screen'

export interface IntakeState {
  phase: IntakePhase
  currentQuestionIndex: number
  registrationQuestions: Question[]
  registrationAnswers: Record<string, string>
  safetyScreenQuestions: Question[]
  safetyScreenAnswers: Record<string, string>
  chiefComplaintCategories: ChiefComplaintCategory[]
  selectedCategories: CategorySelectionItem[]
  chiefComplaintSubcategories: ChiefComplaintSubcategory[]
  // Subcategories grouped by category_id: { [category_id]: string[] of family_ids }
  selectedSubcategoriesByCategory: Record<string, string[]>
  currentSubcategoryGroupIndex: number
  chiefComplaintText: string
  // Per-category timing data: { [category_id]: { onsetBucket, trend } }
  categoryTimingData: Record<string, { onsetBucket: OnsetBucket | ''; trend: Trend | '' }>
  encounterId: string | null
  error: string | null
  uiMessage: string | null
  encounterToken: string | null
}

export type IntakeAction =
  | { type: 'SET_REGISTRATION_QUESTIONS'; questions: Question[] }
  | { type: 'ANSWER_REGISTRATION'; questionId: string; answer: string }
  | { type: 'COMPLETE_REGISTRATION' }
  | { type: 'SET_SAFETY_SCREEN_QUESTIONS'; questions: Question[] }
  | { type: 'ANSWER_SAFETY_SCREEN'; questionId: string; answer: string }
  | { type: 'NEXT_QUESTION' }
  | { type: 'SET_LOADING' }
  | { type: 'SET_ERROR'; error: string }
  | { type: 'SET_COMPLETE'; uiMessage: string | null; encounterToken: string | null }
  | { type: 'SET_FAILED_SAFETY_SCREEN'; uiMessage: string | null; encounterToken: string | null }
  | { type: 'SET_ENCOUNTER_ID'; encounterId: string }
  // Chief Complaint Actions
  | { type: 'SET_CHIEF_COMPLAINT_LOADING_CATEGORIES' }
  | { type: 'SET_CHIEF_COMPLAINT_CATEGORIES'; categories: ChiefComplaintCategory[] }
  | { type: 'SELECT_CATEGORY'; category: CategorySelectionItem }
  | { type: 'DESELECT_CATEGORY'; categoryId: string }
  | { type: 'COMPLETE_CATEGORY_SELECTION' }
  | { type: 'SET_CHIEF_COMPLAINT_LOADING_SUBCATEGORIES' }
  | { type: 'SET_CHIEF_COMPLAINT_SUBCATEGORIES'; subcategories: ChiefComplaintSubcategory[] }
  | { type: 'SELECT_SUBCATEGORY'; categoryId: string; familyId: string }
  | { type: 'DESELECT_SUBCATEGORY'; categoryId: string; familyId: string }
  | { type: 'NEXT_SUBCATEGORY_GROUP' }
  | { type: 'SET_CATEGORY_TIMING'; categoryId: string; onsetBucket: OnsetBucket | ''; trend: Trend | '' }
  | { type: 'SET_CHIEF_COMPLAINT_TEXT_PHASE' }
  | { type: 'SET_CHIEF_COMPLAINT_TEXT'; text: string }
  | { type: 'COMPLETE_CHIEF_COMPLAINT' }

