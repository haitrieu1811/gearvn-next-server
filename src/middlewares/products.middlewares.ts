import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import isPlainObject from 'lodash/isPlainObject'
import { ObjectId } from 'mongodb'

import { HttpStatusCode, ProductApprovalStatus, ProductStatus, RoleField, RoleType, UserType } from '~/constants/enum'
import { GENERAL_MESSAGES, PRODUCTS_MESSAGES } from '~/constants/message'
import { brandIdSchema } from '~/middlewares/brands.middlewares'
import { productCategoryIdSchema } from '~/middlewares/productCategories.middlewares'
import { ErrorWithStatus } from '~/models/Errors'
import { TokenPayload } from '~/models/requests/User.requests'
import databaseService from '~/services/database.services'
import { numberEnumToArray } from '~/utils/utils'
import { validate } from '~/utils/validation'

const SPECTIFICATION_FIELD_COUNT = 2

const productStatuses = numberEnumToArray(ProductStatus)
const productApprovalStatuses = numberEnumToArray(ProductApprovalStatus)

export const createProductValidator = validate(
  checkSchema(
    {
      productCategoryId: productCategoryIdSchema,
      brandId: brandIdSchema,
      name: {
        trim: true,
        notEmpty: {
          errorMessage: PRODUCTS_MESSAGES.PRODUCT_NAME_IS_REQUIRED
        }
      },
      originalPrice: {
        notEmpty: {
          errorMessage: PRODUCTS_MESSAGES.PRODUCT_ORIGINAL_PRICE_IS_REQUIRED
        },
        custom: {
          options: (value) => {
            if (!Number.isInteger(value) || value < 0) {
              throw new Error(PRODUCTS_MESSAGES.PRODUCT_ORIGINAL_PRICE_MUST_BE_A_POSITIVE_INTEGER)
            }
            return true
          }
        }
      },
      priceAfterDiscount: {
        optional: true,
        custom: {
          options: (value) => {
            if (!Number.isInteger(value) || value < 0) {
              throw new Error(PRODUCTS_MESSAGES.PRODUCT_PRICE_AFTER_DISCOUNT_MUST_BE_A_POSITIVE_INTEGER)
            }
            return true
          }
        }
      },
      shortDescription: {
        trim: true,
        optional: true
      },
      description: {
        trim: true,
        optional: true
      },
      photos: {
        custom: {
          options: (value) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: PRODUCTS_MESSAGES.PRODUCT_PHOTOS_IS_REQUIRED,
                status: HttpStatusCode.BadRequest
              })
            }
            if (!Array.isArray(value)) {
              throw new ErrorWithStatus({
                message: PRODUCTS_MESSAGES.PRODUCT_PHOTOS_MUST_BE_AN_ARRAY,
                status: HttpStatusCode.BadRequest
              })
            }
            if (value.length === 0) {
              throw new ErrorWithStatus({
                message: PRODUCTS_MESSAGES.PRODUCT_PHOTOS_CAN_NOT_BE_EMPTY,
                status: HttpStatusCode.BadRequest
              })
            }
            const isValid = value.every((item) => ObjectId.isValid(item))
            if (!isValid) {
              throw new ErrorWithStatus({
                message: PRODUCTS_MESSAGES.INVALID_PRODUCT_PHOTOS,
                status: HttpStatusCode.BadRequest
              })
            }
            return true
          }
        }
      },
      thumbnail: {
        trim: true,
        custom: {
          options: (value: string) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: PRODUCTS_MESSAGES.PRODUCT_THUMBNAIL_IS_REQUIRED,
                status: HttpStatusCode.BadRequest
              })
            }
            if (!ObjectId.isValid(value)) {
              throw new ErrorWithStatus({
                message: PRODUCTS_MESSAGES.INVALID_PRODUCT_THUMBNAIL,
                status: HttpStatusCode.BadRequest
              })
            }
            return true
          }
        }
      },
      orderNumber: {
        optional: true,
        custom: {
          options: (value) => {
            if (!Number.isInteger(value) || value < 0) {
              throw new ErrorWithStatus({
                message: PRODUCTS_MESSAGES.PRODUCT_ORDER_NUMBER_MUST_BE_A_POSITIVE_INTEGER,
                status: HttpStatusCode.BadRequest
              })
            }
            return true
          }
        }
      },
      specifications: {
        optional: true,
        custom: {
          options: (value) => {
            if (!Array.isArray(value)) {
              throw new ErrorWithStatus({
                message: PRODUCTS_MESSAGES.PRODUCT_SPECIFICATIONS_MUST_BE_AN_ARRAY,
                status: HttpStatusCode.BadRequest
              })
            }
            if (value.length === 0) {
              throw new ErrorWithStatus({
                message: PRODUCTS_MESSAGES.PRODUCT_SPECIFICATIONS_CAN_NOT_BE_EMPTY,
                status: HttpStatusCode.BadRequest
              })
            }
            const isAllPlainObject = value.every((item) => isPlainObject(item))
            if (!isAllPlainObject) {
              throw new ErrorWithStatus({
                message: PRODUCTS_MESSAGES.INVALID_PRODUCT_SPECIFICATIONS,
                status: HttpStatusCode.BadRequest
              })
            }
            const isValid = value.every((item) => {
              const fieldCount = Object.keys(item).length
              if (fieldCount !== SPECTIFICATION_FIELD_COUNT || !('key' in item) || !('value' in item)) {
                return false
              }
              return true
            })
            if (!isValid) {
              throw new ErrorWithStatus({
                message: PRODUCTS_MESSAGES.INVALID_PRODUCT_SPECIFICATIONS,
                status: HttpStatusCode.BadRequest
              })
            }
            return true
          }
        }
      },
      status: {
        optional: true,
        custom: {
          options: (value) => {
            if (!productStatuses.includes(value)) {
              throw new ErrorWithStatus({
                message: PRODUCTS_MESSAGES.INVALID_PRODUCT_STATUS,
                status: HttpStatusCode.BadRequest
              })
            }
            return true
          }
        }
      },
      approvalStatus: {
        optional: true,
        custom: {
          options: (value) => {
            if (!productApprovalStatuses.includes(value)) {
              throw new ErrorWithStatus({
                message: PRODUCTS_MESSAGES.INVALID_PRODUCT_APPROVAL_STATUS,
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

export const createProductRoleValidator = async (req: Request, _: Response, next: NextFunction) => {
  const { userId, userType } = req.decodedAuthorization as TokenPayload
  if (userType === UserType.Admin) {
    next()
  } else if (userType === UserType.Customer) {
    next(
      new ErrorWithStatus({
        message: GENERAL_MESSAGES.PERMISSION_DENIED,
        status: HttpStatusCode.Forbidden
      })
    )
  } else {
    const createProductRole = await databaseService.roles.findOne({
      type: RoleType.Create,
      field: RoleField.Product
    })
    const role = await databaseService.userRoles.findOne({
      userId: new ObjectId(userId),
      roleId: createProductRole?._id
    })
    if (!role) {
      next(
        new ErrorWithStatus({
          message: GENERAL_MESSAGES.PERMISSION_DENIED,
          status: HttpStatusCode.Forbidden
        })
      )
    }
    next()
  }
}
