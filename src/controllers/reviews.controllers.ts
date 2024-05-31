import { Request, Response } from 'express'
import { ObjectId } from 'mongodb'

import { REVIEWS_MESSAGES } from '~/constants/message'
import { ProductIdReqParams } from '~/models/requests/Product.requests'
import { CreateReviewReqBody } from '~/models/requests/Review.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import reviewService from '~/services/reviews.services'

export const createReviewController = async (
  req: Request<ProductIdReqParams, any, CreateReviewReqBody>,
  res: Response
) => {
  const { userId } = req.decodedAuthorization as TokenPayload
  const result = await reviewService.create({
    data: req.body,
    userId: new ObjectId(userId),
    productId: new ObjectId(req.params.productId)
  })
  return res.json({
    message: REVIEWS_MESSAGES.CREATE_REVIEW_SUCCESS,
    data: result
  })
}
