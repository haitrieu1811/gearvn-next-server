import { ParamSchema, checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'

import { BrandStatus, HttpStatusCode } from '~/constants/enum'
import { BRANDS_MESSAGES } from '~/constants/message'
import { ErrorWithStatus } from '~/models/Errors'
import databaseService from '~/services/database.services'
import { numberEnumToArray } from '~/utils/utils'
import { validate } from '~/utils/validation'

const brandStatuses = numberEnumToArray(BrandStatus)

const thumbnailSchema: ParamSchema = {
  trim: true,
  notEmpty: {
    errorMessage: BRANDS_MESSAGES.BRAND_THUMBNAIL_IS_REQUIRED
  },
  isMongoId: {
    errorMessage: BRANDS_MESSAGES.INVALID_BRAND_THUMBNAIL
  }
}

const descriptionSchema: ParamSchema = {
  trim: true,
  optional: true
}

const statusSchema: ParamSchema = {
  optional: true,
  isIn: {
    options: [brandStatuses],
    errorMessage: BRANDS_MESSAGES.INVALID_BRAND_STATUS
  }
}

const orderNumberSchema: ParamSchema = {
  optional: true,
  custom: {
    options: (value) => {
      if (!Number.isInteger(value) || value < 0) {
        throw new Error(BRANDS_MESSAGES.ORDER_NUMBER_MUST_BE_A_POSITIVE_INTEGER)
      }
      return true
    }
  }
}

export const createBrandValidator = validate(
  checkSchema(
    {
      thumbnail: thumbnailSchema,
      name: {
        trim: true,
        notEmpty: {
          errorMessage: BRANDS_MESSAGES.BRAND_NAME_IS_REQUIRED
        }
      },
      description: descriptionSchema,
      status: statusSchema,
      orderNumber: orderNumberSchema
    },
    ['body']
  )
)

export const brandIdValidator = validate(
  checkSchema(
    {
      brandId: {
        trim: true,
        custom: {
          options: async (value: string) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: BRANDS_MESSAGES.BRAND_ID_IS_REQUIRED,
                status: HttpStatusCode.BadRequest
              })
            }
            if (!ObjectId.isValid(value)) {
              throw new ErrorWithStatus({
                message: BRANDS_MESSAGES.INVALID_BRAND_ID,
                status: HttpStatusCode.BadRequest
              })
            }
            const brand = await databaseService.brands.findOne({ _id: new ObjectId(value) })
            if (!brand) {
              throw new ErrorWithStatus({
                message: BRANDS_MESSAGES.BRAND_NOT_FOUND,
                status: HttpStatusCode.NotFound
              })
            }
            return true
          }
        }
      }
    },
    ['params']
  )
)

export const updateBrandValidator = validate(
  checkSchema(
    {
      thumbnail: {
        ...thumbnailSchema,
        optional: true,
        notEmpty: undefined
      },
      name: {
        trim: true,
        optional: true
      },
      description: descriptionSchema,
      status: statusSchema,
      orderNumber: orderNumberSchema
    },
    ['body']
  )
)
