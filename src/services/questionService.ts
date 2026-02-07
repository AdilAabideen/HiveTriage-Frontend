const API_BASE_URL = 'http://127.0.0.1:8000'

export const questionService = {
  getPreliminaryQuestions: async () => {
    const response = await fetch(`${API_BASE_URL}/get-questions`)
    if (!response.ok) {
      throw new Error('Failed to fetch questions')
    }
    return response.json()
  },
}

