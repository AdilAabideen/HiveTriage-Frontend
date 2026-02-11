/**
 * Safety Screen related types
 */

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

