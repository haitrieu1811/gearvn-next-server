import { NextFunction, Request, Response } from 'express'
import { ParamSchema, checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'

import { HttpStatusCode, ProductCategoryStatus } from '~/constants/enum'
import { PRODUCT_CATEGORY_MESSAGES } from '~/constants/message'
import { ErrorWithStatus } from '~/models/Errors'
import { ProductCategoryIdReqParams } from '~/models/requests/ProductCategory.requests'
import databaseService from '~/services/database.services'
import { numberEnumToArray } from '~/utils/utils'
import { validate } from '~/utils/validation'

const productCategoryStatuses = numberEnumToArray(ProductCategoryStatus)

const thumbnailSchema: ParamSchema = {
  trim: true,
  notEmpty: {
    errorMessage: PRODUCT_CATEGORY_MESSAGES.PRODUCT_CATEGORY_THUMBNAIL_IS_REQUIRED
  },
  isMongoId: {
    errorMessage: PRODUCT_CATEGORY_MESSAGES.INVALID_PRODUCT_CATEGORY_THUMBNAIL
  }
}

const descriptionSchema: ParamSchema = {
  trim: true,
  optional: true
}

const statusSchema: ParamSchema = {
  optional: true,
  isIn: {
    options: [productCategoryStatuses],
    errorMessage: PRODUCT_CATEGORY_MESSAGES.INVALID_PRODUCT_CATEGORY_STATUS
  }
}

const orderNumberSchema: ParamSchema = {
  optional: true,
  custom: {
    options: (value) => {
      const _value = Number(value)
      if (!Number.isInteger(_value) || _value < 0) {
        throw new Error(PRODUCT_CATEGORY_MESSAGES.ORDER_NUMBER_MUST_BE_A_POSITIVE_INTEGER)
      }
      return true
    }
  }
}

export const productCategoryIdSchema: ParamSchema = {
  trim: true,
  custom: {
    options: async (value: string) => {
      if (!value) {
        throw new ErrorWithStatus({
          message: PRODUCT_CATEGORY_MESSAGES.PRODUCT_CATEGORY_ID_IS_REQUIRED,
          status: HttpStatusCode.BadRequest
        })
      }
      if (!ObjectId.isValid(value)) {
        throw new ErrorWithStatus({
          message: PRODUCT_CATEGORY_MESSAGES.INVALID_PRODUCT_CATEGORY_ID,
          status: HttpStatusCode.BadRequest
        })
      }
      const productCategory = await databaseService.productCategories.findOne({ _id: new ObjectId(value) })
      if (!productCategory) {
        throw new ErrorWithStatus({
          message: PRODUCT_CATEGORY_MESSAGES.PRODUCT_CATEGORY_NOT_FOUND,
          status: HttpStatusCode.NotFound
        })
      }
      return true
    }
  }
}

export const createProductCategoryValidator = validate(
  checkSchema(
    {
      thumbnail: thumbnailSchema,
      name: {
        trim: true,
        notEmpty: {
          errorMessage: PRODUCT_CATEGORY_MESSAGES.PRODUCT_CATEGORY_NAME_IS_REQUIRED
        }
      },
      description: descriptionSchema,
      status: statusSchema,
      orderNumber: orderNumberSchema
    },
    ['body']
  )
)

export const productCategoryIdValidator = validate(
  checkSchema(
    {
      productCategoryId: productCategoryIdSchema
    },
    ['params']
  )
)

export const updateProductCategoryValidator = validate(
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

export const isEmptyProductCategoryValidator = async (
  req: Request<ProductCategoryIdReqParams>,
  _: Response,
  next: NextFunction
) => {
  const productsByCategoryId = await databaseService.products
    .find({
      productCategoryId: new ObjectId(req.params.productCategoryId)
    })
    .toArray()
  if (productsByCategoryId.length > 0) {
    next(
      new ErrorWithStatus({
        message: PRODUCT_CATEGORY_MESSAGES.PRODUCT_CATEGORY_NOT_EMPTY,
        status: HttpStatusCode.BadRequest
      })
    )
  }
  next()
}
