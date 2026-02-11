/**
 * Registration/Question related types
 */

import { Severity } from './common'

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

