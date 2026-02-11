/**
 * Chief Complaint related types
 */

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

