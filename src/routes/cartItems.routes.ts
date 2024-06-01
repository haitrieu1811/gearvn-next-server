import { Router } from 'express'

import {
  addProductToCartController,
  deleteCartItemController,
  updateCartItemController
} from '~/controllers/cartItems.controllers'
import {
  addProductToCartValidator,
  cartItemAuthorValidator,
  cartItemIdValidator,
  updateCartItemValidator
} from '~/middlewares/cartItems.middlewares'
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

cartItemsRouter.patch(
  '/:cartItemId',
  accessTokenValidator,
  isVerifiedUserValidator,
  isCustomerValidator,
  cartItemIdValidator,
  cartItemAuthorValidator,
  updateCartItemValidator,
  wrapRequestHandler(updateCartItemController)
)

cartItemsRouter.delete(
  '/:cartItemId',
  accessTokenValidator,
  isVerifiedUserValidator,
  isCustomerValidator,
  cartItemIdValidator,
  cartItemAuthorValidator,
  wrapRequestHandler(deleteCartItemController)
)

export default cartItemsRouter
