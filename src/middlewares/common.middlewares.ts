import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import pick from 'lodash/pick'

import { HttpStatusCode } from '~/constants/enum'
import { GENERAL_MESSAGES } from '~/constants/message'
import { ErrorWithStatus } from '~/models/Errors'
import { validate } from '~/utils/validation'

type FilterKeys<T> = Array<keyof T>

export const filterReqBodyMiddleware = <T>(filterKeys: FilterKeys<T>) => {
  return (req: Request, _: Response, next: NextFunction) => {
    req.body = pick(req.body, filterKeys)
    next()
  }
}

export const paginationValidator = validate(
  checkSchema(
    {
      page: {
        optional: true,
        trim: true,
        custom: {
          options: async (value: string) => {
            const page = Number(value)
            if (!Number.isInteger(page) || page < 1) {
              throw new ErrorWithStatus({
                message: GENERAL_MESSAGES.PAGE_MUST_BE_A_POSITIVE_INTEGER,
                status: HttpStatusCode.BadRequest
              })
            }
            return true
          }
        }
      },
      limit: {
        optional: true,
        trim: true,
        custom: {
          options: async (value: string) => {
            const limit = Number(value)
            if (!Number.isInteger(limit) || limit < 0) {
              throw new ErrorWithStatus({
                message: GENERAL_MESSAGES.LIMIT_MUST_BE_A_POSITIVE_INTEGER,
                status: HttpStatusCode.BadRequest
              })
            }
            return true
          }
        }
      }
    },
    ['query']
  )
)
