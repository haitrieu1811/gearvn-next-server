import { checkSchema } from 'express-validator'

import { HttpStatusCode } from '~/constants/enum'
import { CART_ITEMS_MESSAGES } from '~/constants/message'
import { ErrorWithStatus } from '~/models/Errors'
import { validate } from '~/utils/validation'

export const addProductToCartValidator = validate(
  checkSchema(
    {
      quantity: {
        custom: {
          options: (value) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: CART_ITEMS_MESSAGES.QUANTITY_IS_REQUIRED,
                status: HttpStatusCode.BadRequest
              })
            }
            if (!Number.isInteger(value) || value <= 0) {
              throw new ErrorWithStatus({
                message: CART_ITEMS_MESSAGES.QUANTITY_MUST_BE_A_POSITIVE_INT_GREATER_THAN_ZERO,
                status: HttpStatusCode.BadRequest
              })
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)
