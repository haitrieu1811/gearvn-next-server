import { Router } from 'express'

import {
  createReviewController,
  deleteReviewController,
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
  createReviewValidator,
  notReviewBeforeValidator,
  replyReviewValidator,
  reviewAuthorValidator,
  reviewIdValidator,
  updateReviewValidator
} from '~/middlewares/reviews.middlewares'
import {
  accessTokenValidator,
  isAdminOrStaffValidator,
  isAdminValidator,
  isVerifiedUserValidator
} from '~/middlewares/users.middlewares'
import { CreateReviewReqBody, ReplyReviewReqBody, UpdateReviewReqBody } from '~/models/requests/Review.requests'
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
  isAdminOrStaffValidator,
  reviewIdValidator,
  replyReviewValidator,
  filterReqBodyMiddleware<ReplyReviewReqBody>(['content']),
  wrapRequestHandler(replyReviewController)
)

reviewsRouter.patch(
  '/:reviewId',
  accessTokenValidator,
  isVerifiedUserValidator,
  reviewIdValidator,
  reviewAuthorValidator,
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

reviewsRouter.delete(
  '/:reviewId',
  accessTokenValidator,
  isVerifiedUserValidator,
  reviewIdValidator,
  reviewAuthorValidator,
  wrapRequestHandler(deleteReviewController)
)

export default reviewsRouter
