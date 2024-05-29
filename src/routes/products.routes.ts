import { Router } from 'express'

import {
  createProductController,
  deleteProductController,
  updateProductController
} from '~/controllers/products.controllers'
import {
  createProductRoleValidator,
  createProductValidator,
  deleteProductRoleValidator,
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

productsRouter.delete(
  '/:productId',
  accessTokenValidator,
  isVerifiedUserValidator,
  deleteProductRoleValidator,
  productIdValidator,
  wrapRequestHandler(deleteProductController)
)

export default productsRouter
