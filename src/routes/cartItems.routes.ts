import { Router } from 'express'

import { addProductToCartController } from '~/controllers/cartItems.controllers'
import { addProductToCartValidator } from '~/middlewares/cartItems.middlewares'
import { productIdValidator } from '~/middlewares/products.middlewares'
import { accessTokenValidator, isCustomerValidator, isVerifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

const cartItemsRouter = Router()

cartItemsRouter.post(
  '/add-to-cart/product/:productId',
  accessTokenValidator,
  isVerifiedUserValidator,
  isCustomerValidator,
  productIdValidator,
  addProductToCartValidator,
  wrapRequestHandler(addProductToCartController)
)

export default cartItemsRouter
