import { checkSchema } from 'express-validator'

import { ProductCategoryStatus } from '~/constants/enum'
import { PRODUCT_CATEGORY_MESSAGES } from '~/constants/message'
import { numberEnumToArray } from '~/utils/utils'
import { validate } from '~/utils/validation'

const productCategoryStatuses = numberEnumToArray(ProductCategoryStatus)

export const createProductCategoryValidator = validate(
  checkSchema(
    {
      thumbnail: {
        trim: true,
        notEmpty: {
          errorMessage: PRODUCT_CATEGORY_MESSAGES.PRODUCT_CATEGORY_THUMBNAIL_IS_REQUIRED
        },
        isMongoId: {
          errorMessage: PRODUCT_CATEGORY_MESSAGES.INVALID_PRODUCT_CATEGORY_THUMBNAIL
        }
      },
      name: {
        trim: true,
        notEmpty: {
          errorMessage: PRODUCT_CATEGORY_MESSAGES.PRODUCT_CATEGORY_NAME_IS_REQUIRED
        }
      },
      description: {
        trim: true,
        optional: true
      },
      status: {
        optional: true,
        isIn: {
          options: [productCategoryStatuses],
          errorMessage: PRODUCT_CATEGORY_MESSAGES.INVALID_PRODUCT_CATEGORY_STATUS
        }
      },
      orderNumber: {
        optional: true,
        custom: {
          options: (value) => {
            if (!Number.isInteger(value) || value < 0) {
              throw new Error(PRODUCT_CATEGORY_MESSAGES.ORDER_NUMBER_MUST_BE_A_POSITIVE_INTEGER)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)
