/**
 * Chief Complaint related types
 */

// Base type for CategoryCard component - works for both categories and presentations
export interface CardItem {
  id: string
  label: string
  description: string
  icon?: string | null
}

// Chief Complaint Presentation item (from backend)
export interface ChiefComplaintPresentationsData {
  id: string
  label: string
  description: string
  icon: string | null
  sort_order: number
  patient_label: string
  patient_explanation: string
  patient_examples: string
  patient_avoid_if: string
  synonyms: string
}

export interface ChiefComplaintCategory {
  id: string
  label: string
  description: string
  patient_explanation: string
}

export interface ChiefComplaintPresentation {
  category_name: string
  category_id: string
  presentations: ChiefComplaintPresentationsData[]
}

export interface ChiefComplaintPresentationsResponse {
  num_categories: number
  presentations: ChiefComplaintPresentation[]
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

// Timing per presentation (for onset/trend step)
export interface PresentationTiming {
  onset_bucket: OnsetBucket | ''
  trend: Trend | ''
}

// Chief Complaint Submission Payload (v2)
export interface ChiefComplaintSelectedPresentation {
  category_id: string
  presentation_id: string
  timing: PresentationTiming
}

export interface ChiefComplaintSelectedCategory {
  category_name: string
  category_id: string
  selected_presentations: ChiefComplaintSelectedPresentation[]
}

export interface ChiefComplaintSubmission {
  encounter_id: string | null
  overall_text: string
  selected_categories: ChiefComplaintSelectedCategory[]
}

