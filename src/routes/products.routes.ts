import { Router } from 'express'

import { createProductController, updateProductController } from '~/controllers/products.controllers'
import {
  createProductRoleValidator,
  createProductValidator,
  productIdValidator,
  updateProductRoleValidator
} from '~/middlewares/products.middlewares'
import { accessTokenValidator, isVerifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

const productsRouter = Router()

productsRouter.post(
  '/',
  accessTokenValidator,
  isVerifiedUserValidator,
  createProductRoleValidator,
  createProductValidator,
  wrapRequestHandler(createProductController)
)

productsRouter.put(
  '/:productId',
  accessTokenValidator,
  isVerifiedUserValidator,
  updateProductRoleValidator,
  productIdValidator,
  createProductValidator,
  wrapRequestHandler(updateProductController)
)

export default productsRouter
