export type TriageQuestionType = 'multiple_choice' | 'open_ended' | 'multi_select'

export interface TriageQuestionOption {
  patient_facing_label: string
  internal_label: string
  flag?: 'RED' | 'ORANGE' | 'GREEN'
  trigger?: string[]
  rule_out?: string[]
  observations?: Record<string, unknown>
}

export interface TriageQuestion {
  question_text: string
  patient_facing_hint?: string
  nurse_context?: string
  question_type: TriageQuestionType
  options?: TriageQuestionOption[]
  open_ended_validation_rules?: string[]
}

export interface TriageInterruptResponse {
  status: 'interrupted'
  encounter_id: string
  thread_id: string
  question: TriageQuestion
  interrupt_payload?: {
    tier: number
    question: TriageQuestion
    type: string
  }
}

export interface TriageCompletedResponse {
  status: 'completed'
  encounter_id: string
  thread_id: string
  final_state: {
    current_tier: number
    validation_result?: {
      flag: 'RED' | 'ORANGE' | 'GREEN'
      triggered_discriminators: string[]
      ruled_out_discriminators: string[]
    }
    [key: string]: unknown
  }
}

export type TriageResponse = TriageInterruptResponse | TriageCompletedResponse

export interface TriageProcessRequest {
  encounter_id: string
  thread_id: string | null
}

export interface TriageAnswerRequest {
  thread_id: string
  answer: string[]
}

export interface TriageEncounterSummary {
  encounter_id: string
  patient_name: string
  encounter_token: string
}
