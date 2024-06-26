import express from 'express'
import { ValidationChain, validationResult } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'

import { HttpStatusCode } from '~/constants/enum'
import { EntityError, ErrorWithStatus } from '~/models/Errors'

// sequential processing, stops running validations chain if the previous one fails.
export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await validation.run(req)
    const errors = validationResult(req)
    // Nếu không có lỗi thì next tiếp tục request
    if (errors.isEmpty()) {
      return next()
    }
    // Xử lý khi có lỗi
    const errorsObject = errors.mapped()
    const entityError = new EntityError({ errors: {} })
    for (const key in errorsObject) {
      const { msg } = errorsObject[key]
      // Trả về lỗi không phải là lỗi do validate
      if (msg instanceof ErrorWithStatus && msg.status !== HttpStatusCode.UnprocessableEntity) {
        return next(msg)
      }
      entityError.errors[key] = errorsObject[key].msg
    }
    next(entityError)
  }
}
