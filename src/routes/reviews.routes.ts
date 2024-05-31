import { Router } from 'express'

import {
  createReviewController,
  getAllReviewsController,
  getReviewByProductIdController,
  getReviewDetailController,
  getReviewRepliesController,
  replyReviewController,
  updateReviewController
} from '~/controllers/reviews.controllers'
import { filterReqBodyMiddleware, paginationValidator } from '~/middlewares/common.middlewares'
import { isActiveProductValidator, productIdValidator } from '~/middlewares/products.middlewares'
import {
  authorReviewValidator,
  createReviewValidator,
  notReviewBeforeValidator,
  replyReviewValidator,
  reviewIdValidator,
  updateReviewValidator
} from '~/middlewares/reviews.middlewares'
import { accessTokenValidator, isAdminValidator, isVerifiedUserValidator } from '~/middlewares/users.middlewares'
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

reviewsRouter.get(
  '/product/:productId',
  productIdValidator,
  isActiveProductValidator,
  paginationValidator,
  wrapRequestHandler(getReviewByProductIdController)
)

reviewsRouter.get(
  '/all',
  accessTokenValidator,
  isVerifiedUserValidator,
  isAdminValidator,
  paginationValidator,
  wrapRequestHandler(getAllReviewsController)
)

reviewsRouter.get('/:reviewId', reviewIdValidator, wrapRequestHandler(getReviewDetailController))

reviewsRouter.get(
  '/:reviewId/replies',
  reviewIdValidator,
  paginationValidator,
  wrapRequestHandler(getReviewRepliesController)
)

export default reviewsRouter
