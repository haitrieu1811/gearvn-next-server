import { checkSchema } from 'express-validator'

import { HttpStatusCode, OrderStatus, RoleField, RoleType } from '~/constants/enum'
import { ORDERS_MESSAGES } from '~/constants/message'
import { generateRoleValidator } from '~/middlewares/roles.middlewares'
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
            if (!orderStatuses.includes(Number(value))) {
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
    ['query']
  )
)

export const readAllOrdersRoleValidator = generateRoleValidator({ roleType: RoleType.Read, roleField: RoleField.Order })
