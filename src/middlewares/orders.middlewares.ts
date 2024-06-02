import { checkSchema } from 'express-validator'

import { HttpStatusCode, OrderStatus } from '~/constants/enum'
import { ORDERS_MESSAGES } from '~/constants/message'
import { ErrorWithStatus } from '~/models/Errors'
import { numberEnumToArray } from '~/utils/utils'
import { validate } from '~/utils/validation'

const orderStatuses = numberEnumToArray(OrderStatus)

export const getOrdersValidator = validate(
  checkSchema(
    {
      status: {
        optional: true,
        custom: {
          options: (value) => {
            console.log(typeof value)

            if (!orderStatuses.includes(value)) {
              throw new ErrorWithStatus({
                message: ORDERS_MESSAGES.INVALID_ORDER_STATUS,
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
