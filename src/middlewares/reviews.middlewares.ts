import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import range from 'lodash/range'
import { ObjectId } from 'mongodb'

import { HttpStatusCode } from '~/constants/enum'
import { REVIEWS_MESSAGES } from '~/constants/message'
import { ErrorWithStatus } from '~/models/Errors'
import { ProductIdReqParams } from '~/models/requests/Product.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import databaseService from '~/services/database.services'
import { validate } from '~/utils/validation'

const starPoints = range(1, 6)

export const createReviewValidator = validate(
  checkSchema(
    {
      starPoint: {
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
      },
      content: {
        optional: true,
        trim: true
      },
      photos: {
        optional: true,
        custom: {
          options: (value) => {
            if (!Array.isArray(value) || value.length === 0) {
              throw new ErrorWithStatus({
                message: REVIEWS_MESSAGES.PHOTOS_MUST_BE_AN_ARRAY_NOT_EMPTY,
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
    },
    ['body']
  )
)

export const notReviewBeforeValidator = async (req: Request<ProductIdReqParams>, _: Response, next: NextFunction) => {
  const { userId } = req.decodedAuthorization as TokenPayload
  const review = await databaseService.reviews.findOne({
    userId: new ObjectId(userId),
    productId: new ObjectId(req.params.productId)
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
