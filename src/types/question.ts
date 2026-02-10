export type Severity = 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN'

export interface Question {
  question_id: string
  text: string
  response_type: string
  response_options: string[] | null
  response_format?: string
  response: string | null
  severity_if_positive?: Severity
  treat_not_sure_as_positive?: boolean
  rationale?: string
}

export type QuestionsResponse = Question[]

// Chief Complaint Category
export interface ChiefComplaintCategory {
  id: string
  label: string
  description: string
  icon: string
  sort_order: number
}

export interface ChiefComplaintSubcategory {
  category_name: string
  category_id: string
  subcategories: ChiefComplaintCategory[]
}

export interface ChiefComplaintSubcategoriesResponse {
  num_categories: number
  subcategories: ChiefComplaintSubcategory[]
}
// Category Selection Item (for API submission)
export interface CategorySelectionItem {
  id: string
  name: string
}

// Onset Bucket - when symptoms started
export type OnsetBucket = 
  | 'today'
  | 'yesterday'
  | 'two_to_seven_days'
  | 'more_than_one_week'
  | 'not_sure'

// Trend - how symptoms are changing
export type Trend = 
  | 'worse'
  | 'same'
  | 'better'
  | 'fluctuating'
  | 'not_sure'

// Chief Complaint Submission Payload
export interface ChiefComplaintSelection {
  category_id: string
  onset_bucket: OnsetBucket | ''
  trend: Trend | ''
  family_ids: string[]
}

export interface ChiefComplaintSubmission {
  encounter_id: string | null
  selections: ChiefComplaintSelection[]
  overall_text: string
}

// Safety Screen Answer Response
export type FinalAction = 'PROCEED_TO_STAGE_2' | 'SHOW_WAIT_SCREEN'

export interface SafetyScreenAnswerResponse {
  status: string
  encounter_id: string
  encounter_token: string
  question_id: string
  overall_risk_level: string
  triggered_questions: string[]
  is_last_question: boolean
  final_action: FinalAction | null
  ui_message: string | null
}

// Intake Flow Types
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
