import { Router } from 'express'

import { createReviewController } from '~/controllers/reviews.controllers'
import { filterReqBodyMiddleware } from '~/middlewares/common.middlewares'
import { productIdValidator } from '~/middlewares/products.middlewares'
import { createReviewValidator, notReviewBeforeValidator } from '~/middlewares/reviews.middlewares'
import { accessTokenValidator, isVerifiedUserValidator } from '~/middlewares/users.middlewares'
import { CreateReviewReqBody } from '~/models/requests/Review.requests'
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

export default reviewsRouter
