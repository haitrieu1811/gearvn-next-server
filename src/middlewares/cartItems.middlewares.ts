import { NextFunction, Request, Response } from 'express'
import { ParamSchema, checkSchema } from 'express-validator'
import { ObjectId, WithId } from 'mongodb'

import { HttpStatusCode } from '~/constants/enum'
import { CART_ITEMS_MESSAGES, GENERAL_MESSAGES } from '~/constants/message'
import { ErrorWithStatus } from '~/models/Errors'
import CartItem from '~/models/databases/CartItem.database'
import { TokenPayload } from '~/models/requests/User.requests'
import databaseService from '~/services/database.services'
import { validate } from '~/utils/validation'

const quantitySchema: ParamSchema = {
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

export const addProductToCartValidator = validate(
  checkSchema(
    {
      quantity: quantitySchema
    },
    ['body']
  )
)

export const cartItemIdValidator = validate(
  checkSchema(
    {
      cartItemId: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: CART_ITEMS_MESSAGES.CART_ITEM_ID_IS_REQUIRED,
                status: HttpStatusCode.BadRequest
              })
            }
            if (!ObjectId.isValid(value)) {
              throw new ErrorWithStatus({
                message: CART_ITEMS_MESSAGES.INVALID_CART_ITEM_ID,
                status: HttpStatusCode.BadRequest
              })
            }
            const cartItem = await databaseService.cartItems.findOne({ _id: new ObjectId(value) })
            if (!cartItem) {
              throw new ErrorWithStatus({
                message: CART_ITEMS_MESSAGES.CART_ITEM_NOT_FOUND,
                status: HttpStatusCode.NotFound
              })
            }
            ;(req as Request).cartItem = cartItem
            return true
          }
        }
      }
    },
    ['params']
  )
)

export const cartItemAuthorValidator = async (req: Request, _: Response, next: NextFunction) => {
  const cartItem = req.cartItem as WithId<CartItem>
  const { userId } = req.decodedAuthorization as TokenPayload
  if (cartItem.userId.toString() !== userId) {
    next(
      new ErrorWithStatus({
        message: GENERAL_MESSAGES.PERMISSION_DENIED,
        status: HttpStatusCode.Forbidden
      })
    )
  }
  next()
}

export const updateCartItemValidator = validate(
  checkSchema(
    {
      quantity: quantitySchema
    },
    ['body']
  )
)
