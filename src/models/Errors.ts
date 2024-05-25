import { HttpStatusCode } from '~/constants/enum'
import { GENERAL_MESSAGES } from '~/constants/message'

type ErrorsType = Record<
  string,
  {
    msg: string
    [key: string]: any
  }
>

export class ErrorWithStatus {
  enMessage: string
  viMessage: string
  status: number

  constructor({ enMessage, viMessage, status }: { enMessage: string; viMessage: string; status: number }) {
    this.enMessage = enMessage
    this.viMessage = viMessage
    this.status = status
  }
}

export class EntityError extends ErrorWithStatus {
  errors: ErrorsType

  constructor({
    enMessage = GENERAL_MESSAGES.EN_VALIDATION_ERROR,
    viMessage = GENERAL_MESSAGES.EN_VALIDATION_ERROR,
    errors
  }: {
    enMessage?: string
    viMessage?: string
    errors: ErrorsType
  }) {
    super({ enMessage, viMessage, status: HttpStatusCode.UnprocessableEntity })
    this.errors = errors
  }
}
