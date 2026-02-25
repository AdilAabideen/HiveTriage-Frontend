import { config } from '../config/env'
import {
  TriageAnswerRequest,
  TriageEncounterSummary,
  TriageProcessRequest,
  TriageResponse,
} from '../types'

const API_BASE_URL = config.apiBaseUrl

export const triageService = {
  process: async (payload: TriageProcessRequest): Promise<TriageResponse> => {
    const response = await fetch(`${API_BASE_URL}/triage/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const message = await response.text()
      throw new Error(message || 'Failed to start triage')
    }

    return response.json()
  },

  answer: async (payload: TriageAnswerRequest): Promise<TriageResponse> => {
    const response = await fetch(`${API_BASE_URL}/triage/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const message = await response.text()
      throw new Error(message || 'Failed to submit answer')
    }

    return response.json()
  },

  getEncounterSummary: async (encounterId: string): Promise<TriageEncounterSummary> => {
    const response = await fetch(`${API_BASE_URL}/triage/encounter-summary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ encounter_id: encounterId }),
    })

    if (!response.ok) {
      const message = await response.text()
      throw new Error(message || 'Failed to fetch encounter summary')
    }

    return response.json()
  },
}
