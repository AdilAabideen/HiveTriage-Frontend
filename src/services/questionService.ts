import { CategorySelectionItem, ChiefComplaintSubmission } from '../types/question'

const API_BASE_URL = 'http://127.0.0.1:8000'

// Type for category selection submission
interface CategorySelection {
  categories: CategorySelectionItem[]
}

export const questionService = {
  getRegistrationQuestions: async () => {
    const response = await fetch(`${API_BASE_URL}/get-initial-questions`)
    if (!response.ok) {
      throw new Error('Failed to fetch registration questions')
    }
    return response.json()
  },

  getSafetyScreenQuestions: async () => {
    const response = await fetch(`${API_BASE_URL}/get-questions`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    if (!response.ok) {
      throw new Error('Failed to fetch safety screen questions')
    }
    return response.json()
  },

  submitRegistration: async (registrationAnswers: Record<string, string>) => {
    const response = await fetch(`${API_BASE_URL}/submit-registration`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registrationAnswers)
    })
    if (!response.ok) {
      throw new Error('Failed to submit registration')
    }
    return response.json()
  },

  submitSafetyScreenAnswer: async (questionId: string, answer: string, encounterId: string) => {
    const response = await fetch(`${API_BASE_URL}/submit-safety-answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question_id: questionId,
        answer: answer,
        encounter_id: encounterId
      })
    })
    if (!response.ok) {
      throw new Error('Failed to submit safety screen answer')
    }
    return response.json()
  },

  getChiefComplaintCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/chief-complaint/categories`)
    if (!response.ok) {
      throw new Error('Failed to fetch chief complaint categories')
    }
    const data = await response.json()
    // Map category_id to id for frontend consistency
    return data.map((cat: { category_id: string; label: string; description: string; icon: string; sort_order: number }) => ({
      id: cat.category_id,
      label: cat.label,
      description: cat.description,
      icon: cat.icon,
      sort_order: cat.sort_order
    }))
  },

  getChiefComplaintSubcategories: async (selection: CategorySelection) => {
    const response = await fetch(`${API_BASE_URL}/chief-complaint/subcategories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selection)
    })
    if (!response.ok) {
      throw new Error('Failed to fetch chief complaint subcategories')
    }
    const data = await response.json()

    // Map through subcategories_by_category, keeping grouped structure
    const subcategories = data.subcategories_by_category.map(
      (category: { category_name: string; category_id: string; subcategories: Array<{ family_id: string; label: string; description: string; icon: string; sort_order: number }> }) => ({
        category_name: category.category_name,
        category_id: category.category_id,
        subcategories: category.subcategories.map((sub) => ({
          id: sub.family_id,
          label: sub.label,
          description: sub.description,
          icon: sub.icon,
          sort_order: sub.sort_order
        }))
      })
    )

    return {
      num_categories: data.num_categories,
      subcategories
    }
  },

  submitChiefComplaint: async (payload: ChiefComplaintSubmission) => {
    const response = await fetch(`${API_BASE_URL}/submit-chief-complaint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        encounter_id: payload.encounter_id,
        selections: payload.selections.map(selection => ({
          category_id: selection.category_id,
          onset_bucket: selection.onset_bucket || null,
          trend: selection.trend || null,
          family_ids: selection.family_ids
        })),
        overall_text: payload.overall_text || null
      })
    })
    if (!response.ok) {
      throw new Error('Failed to submit chief complaint')
    }
    return response.json()
  }
}
