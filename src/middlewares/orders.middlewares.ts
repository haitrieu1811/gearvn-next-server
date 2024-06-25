import { NextFunction, Request, Response } from 'express'
import { ParamSchema, checkSchema } from 'express-validator'
import { ObjectId, WithId } from 'mongodb'

import { HttpStatusCode, OrderStatus, RoleField, RoleType } from '~/constants/enum'
import { GENERAL_MESSAGES, ORDERS_MESSAGES } from '~/constants/message'
import { generateRoleValidator } from '~/middlewares/roles.middlewares'
import { ErrorWithStatus } from '~/models/Errors'
import Order from '~/models/databases/Order.database'
import { TokenPayload } from '~/models/requests/User.requests'
import databaseService from '~/services/database.services'
import { numberEnumToArray } from '~/utils/utils'
import { validate } from '~/utils/validation'

const orderStatuses = numberEnumToArray(OrderStatus)

const statusSchema: ParamSchema = {
  custom: {
    options: (value) => {
      if (!value) {
        throw new ErrorWithStatus({
          message: ORDERS_MESSAGES.ORDER_STATUS_IS_REQUIRED,
          status: HttpStatusCode.BadRequest
        })
      }
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

export const getOrdersValidator = validate(
  checkSchema(
    {
      status: {
        ...statusSchema,
        optional: true
      }
    },
    ['query']
  )
)

export const readAllOrdersRoleValidator = generateRoleValidator({ roleType: RoleType.Read, roleField: RoleField.Order })

export const updateOrderRoleValidator = generateRoleValidator({ roleType: RoleType.Update, roleField: RoleField.Order })

export const deleteOrderRoleValidator = generateRoleValidator({ roleType: RoleType.Delete, roleField: RoleField.Order })

export const orderIdValidator = validate(
  checkSchema(
    {
      orderId: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: ORDERS_MESSAGES.ORDER_IS_REQUIRED,
                status: HttpStatusCode.BadRequest
              })
            }
            if (!ObjectId.isValid(value)) {
              throw new ErrorWithStatus({
                message: ORDERS_MESSAGES.INVALID_ORDER_ID,
                status: HttpStatusCode.BadRequest
              })
            }
            const order = await databaseService.orders.findOne({ _id: new ObjectId(value) })
            if (!order) {
              throw new ErrorWithStatus({
                message: ORDERS_MESSAGES.ORDER_NOT_FOUND,
                status: HttpStatusCode.NotFound
              })
            }
            ;(req as Request).order = order
            return true
          }
        }
      }
    },
    ['params']
  )
)

export const orderAuthorValidator = async (req: Request, _: Response, next: NextFunction) => {
  const order = req.order as WithId<Order>
  const { userId } = req.decodedAuthorization as TokenPayload
  if (order.userId.toString() !== userId) {
    next(
      new ErrorWithStatus({
        message: GENERAL_MESSAGES.PERMISSION_DENIED,
        status: HttpStatusCode.Forbidden
      })
    )
  }
  next()
}

export const updateOrderValidator = validate(
  checkSchema(
    {
      status: statusSchema
    },
    ['body']
  )
)
