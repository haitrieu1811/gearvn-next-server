import { Router } from 'express'

import { createProductController } from '~/controllers/products.controllers'
import { createProductRoleValidator, createProductValidator } from '~/middlewares/products.middlewares'
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

export default productsRouter
