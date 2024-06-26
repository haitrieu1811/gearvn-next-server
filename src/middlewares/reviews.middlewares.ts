import { NextFunction, Request, Response } from 'express'
import { ParamSchema, checkSchema } from 'express-validator'
import range from 'lodash/range'
import { ObjectId, WithId } from 'mongodb'

import { HttpStatusCode } from '~/constants/enum'
import { GENERAL_MESSAGES, REVIEWS_MESSAGES } from '~/constants/message'
import { ErrorWithStatus } from '~/models/Errors'
import Review from '~/models/databases/Review.database'
import { ProductIdReqParams } from '~/models/requests/Product.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import databaseService from '~/services/database.services'
import { validate } from '~/utils/validation'

const starPoints = range(1, 6)

const starPointSchema: ParamSchema = {
  custom: {
    options: (value) => {
      if (value === undefined) {
        throw new ErrorWithStatus({
          message: REVIEWS_MESSAGES.STAR_POINT_IS_REQUIRED,
          status: HttpStatusCode.BadRequest
        })
      }
      if (!starPoints.includes(value)) {
        throw new ErrorWithStatus({
          message: REVIEWS_MESSAGES.INVALID_STAR_POINT,
          status: HttpStatusCode.BadRequest
        })
      }
      return true
    }
  }
}

const photosSchema: ParamSchema = {
  optional: true,
  custom: {
    options: (value) => {
      if (!Array.isArray(value)) {
        throw new ErrorWithStatus({
          message: REVIEWS_MESSAGES.PHOTOS_MUST_BE_AN_ARRAY,
          status: HttpStatusCode.BadRequest
        })
      }
      const isAllValid = value.every((item) => ObjectId.isValid(item))
      if (!isAllValid) {
        throw new ErrorWithStatus({
          message: REVIEWS_MESSAGES.INVALID_PHOTOS,
          status: HttpStatusCode.BadRequest
        })
      }
      return true
    }
  }
}

export const createReviewValidator = validate(
  checkSchema(
    {
      starPoint: starPointSchema,
      content: {
        optional: true,
        trim: true
      },
      photos: photosSchema
    },
    ['body']
  )
)

export const notReviewBeforeValidator = async (req: Request<ProductIdReqParams>, _: Response, next: NextFunction) => {
  const { userId } = req.decodedAuthorization as TokenPayload
  const review = await databaseService.reviews.findOne({
    userId: new ObjectId(userId),
    productId: new ObjectId(req.params.productId),
    parentId: null
  })
  if (review) {
    next(
      new ErrorWithStatus({
        message: REVIEWS_MESSAGES.REVIEWD_BEFORE,
        status: HttpStatusCode.BadRequest
      })
    )
  }
  next()
}

export const reviewIdValidator = validate(
  checkSchema(
    {
      reviewId: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: REVIEWS_MESSAGES.REVIEW_ID_IS_REQUIRED,
                status: HttpStatusCode.BadRequest
              })
            }
            if (!ObjectId.isValid(value)) {
              throw new ErrorWithStatus({
                message: REVIEWS_MESSAGES.INVALID_REVIEW_ID,
                status: HttpStatusCode.BadRequest
              })
            }
            const review = await databaseService.reviews.findOne({ _id: new ObjectId(value) })
            if (!review) {
              throw new ErrorWithStatus({
                message: REVIEWS_MESSAGES.REVIEW_NOT_FOUND,
                status: HttpStatusCode.NotFound
              })
            }
            ;(req as Request).review = review
            return true
          }
        }
      }
    },
    ['params']
  )
)

export const replyReviewValidator = validate(
  checkSchema(
    {
      content: {
        trim: true,
        notEmpty: {
          errorMessage: REVIEWS_MESSAGES.REVIEW_REPLY_CONTENT_IS_REQUIRED
        }
      }
    },
    ['body']
  )
)

export const updateReviewValidator = validate(
  checkSchema(
    {
      starPoint: {
        ...starPointSchema,
        optional: true
      },
      content: {
        optional: true,
        trim: true
      },
      photos: photosSchema
    },
    ['body']
  )
)

export const reviewAuthorValidator = async (req: Request, _: Response, next: NextFunction) => {
  const review = req.review as WithId<Review>
  const { userId } = req.decodedAuthorization as TokenPayload
  if (review.userId.toString() !== userId) {
    next(
      new ErrorWithStatus({
        message: GENERAL_MESSAGES.PERMISSION_DENIED,
        status: HttpStatusCode.Forbidden
      })
    )
  }
  next()
}
