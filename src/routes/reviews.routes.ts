import { Router } from 'express'

import {
  createReviewController,
  replyReviewController,
  updateReviewController
} from '~/controllers/reviews.controllers'
import { filterReqBodyMiddleware } from '~/middlewares/common.middlewares'
import { productIdValidator } from '~/middlewares/products.middlewares'
import {
  authorReviewValidator,
  createReviewValidator,
  notReviewBeforeValidator,
  replyReviewValidator,
  reviewIdValidator,
  updateReviewValidator
} from '~/middlewares/reviews.middlewares'
import { accessTokenValidator, isVerifiedUserValidator } from '~/middlewares/users.middlewares'
import { CreateReviewReqBody, UpdateReviewReqBody } from '~/models/requests/Review.requests'
import { wrapRequestHandler } from '~/utils/handler'

const reviewsRouter = Router()

reviewsRouter.post(
  '/product/:productId',
  accessTokenValidator,
  isVerifiedUserValidator,
  productIdValidator,
  notReviewBeforeValidator,
  createReviewValidator,
  filterReqBodyMiddleware<CreateReviewReqBody>(['content', 'photos', 'starPoint']),
  wrapRequestHandler(createReviewController)
)

reviewsRouter.post(
  '/:reviewId/reply',
  accessTokenValidator,
  isVerifiedUserValidator,
  reviewIdValidator,
  replyReviewValidator,
  wrapRequestHandler(replyReviewController)
)

reviewsRouter.patch(
  '/:reviewId',
  accessTokenValidator,
  isVerifiedUserValidator,
  reviewIdValidator,
  authorReviewValidator,
  updateReviewValidator,
  filterReqBodyMiddleware<UpdateReviewReqBody>(['content', 'photos', 'starPoint']),
  wrapRequestHandler(updateReviewController)
)

export default reviewsRouter
