import { CategorySelectionItem, ChiefComplaintSubmission } from '../types/question'
import { config } from '../config/env'

const API_BASE_URL = config.apiBaseUrl

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

  getChiefComplaintCategories: async (encounterId: string) => {
    const response = await fetch(`${API_BASE_URL}/v2/chief-complaint/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ encounter_id: encounterId })
    })
    if (!response.ok) {
      throw new Error('Failed to fetch chief complaint categories')
    }
    const data = await response.json()
    // Map category_id to id for frontend consistency
    return data.map((cat: { category_id: string; label: string; description: string; patient_explanation: string }) => ({
      id: cat.category_id,
      label: cat.label,
      description: cat.description,
      patient_explanation: cat.patient_explanation,
    }))
  },

  getChiefComplaintPresentations: async (selection: CategorySelection) => {
    const response = await fetch(`${API_BASE_URL}/v2/chief-complaint/presentations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selection)
    })
    if (!response.ok) {
      throw new Error('Failed to fetch chief complaint presentations')
    }
    const data = await response.json()

    // Map through presentations_by_category, keeping grouped structure
    const presentations = data.presentations_by_category.map(
      (category: { category_name: string; category_id: string; presentations: Array<{ presentation_id: string; label: string; description: string; ui_icon: string; sort_order: number, patient_label: string, patient_explanation: string, patient_examples: string, patient_avoid_if: string, synonyms: string }> }) => ({
        category_name: category.category_name,
        category_id: category.category_id,
        presentations: category.presentations.map((pres) => ({
          id: pres.presentation_id,
          label: pres.label,
          patient_label: pres.patient_label,
          patient_explanation: pres.patient_explanation,
          patient_examples: pres.patient_examples,
          patient_avoid_if: pres.patient_avoid_if,
          description: pres.description,
          icon: pres.ui_icon,
          sort_order: pres.sort_order,
          synonyms: pres.synonyms
        }))
      })
    )

    return {
      num_categories: data.num_categories,
      presentations
    }
  },

  submitChiefComplaint: async (payload: ChiefComplaintSubmission) => {
    const response = await fetch(`${API_BASE_URL}/v2/submit-chief-complaint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        encounter_id: payload.encounter_id,
        overall_text: payload.overall_text || null,
        selected_categories: payload.selected_categories,
      })
    })
    if (!response.ok) {
      throw new Error('Failed to submit chief complaint')
    }
    return response.json()
  }
}
