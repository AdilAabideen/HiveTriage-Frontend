/**
 * Intake Flow state management types
 */

import { Question } from './registration'
import {
  ChiefComplaintCategory,
  ChiefComplaintPresentation,
  CategorySelectionItem,
  PresentationTiming,
} from './chiefComplaint'

export type IntakePhase = 
  | 'registration_questions'
  | 'loading_questions'
  | 'safety_screen_questions'
  | 'chief_complaint_loading_categories'
  | 'chief_complaint_categories'
  | 'chief_complaint_loading_presentations'
  | 'chief_complaint_presentations'
  | 'chief_complaint_presentations_details'
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
  chiefComplaintPresentations: ChiefComplaintPresentation[]
  selectedPresentationsByCategory: Record<string, string[]>
  currentPresentationGroupIndex: number
  chiefComplaintText: string
  presentationTimingById: Record<string, PresentationTiming>
  encounterId: string | null
  error: string | null
  uiMessage: string | null
  encounterToken: string | null
}
