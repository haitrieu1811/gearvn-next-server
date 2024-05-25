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
  message: string
  status: number

  constructor({ message, status }: { message: string; status: number }) {
    this.message = message
    this.status = status
  }
}

export class EntityError extends ErrorWithStatus {
  errors: ErrorsType

  constructor({ message = GENERAL_MESSAGES.VALIDATION_ERROR, errors }: { message?: string; errors: ErrorsType }) {
    super({ message, status: HttpStatusCode.UnprocessableEntity })
    this.errors = errors
  }
}
