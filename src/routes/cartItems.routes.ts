import { Router } from 'express'

import {
  addProductToCartController,
  checkoutController,
  deleteCartItemController,
  getMyCartController,
  updateCartItemController
} from '~/controllers/cartItems.controllers'
import {
  addProductToCartValidator,
  cartItemAuthorValidator,
  cartItemIdValidator,
  checkoutValidator,
  notEmptyCartValidator,
  updateCartItemValidator
} from '~/middlewares/cartItems.middlewares'
import { paginationValidator } from '~/middlewares/common.middlewares'
import { productIdValidator } from '~/middlewares/products.middlewares'
import { accessTokenValidator, isVerifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

const cartItemsRouter = Router()

cartItemsRouter.post(
  '/add-to-cart/product/:productId',
  accessTokenValidator,
  isVerifiedUserValidator,
  productIdValidator,
  addProductToCartValidator,
  wrapRequestHandler(addProductToCartController)
)

cartItemsRouter.patch(
  '/:cartItemId',
  accessTokenValidator,
  isVerifiedUserValidator,
  cartItemIdValidator,
  cartItemAuthorValidator,
  updateCartItemValidator,
  wrapRequestHandler(updateCartItemController)
)

cartItemsRouter.delete(
  '/:cartItemId',
  accessTokenValidator,
  isVerifiedUserValidator,
  cartItemIdValidator,
  cartItemAuthorValidator,
  wrapRequestHandler(deleteCartItemController)
)

cartItemsRouter.get(
  '/me',
  accessTokenValidator,
  isVerifiedUserValidator,
  paginationValidator,
  wrapRequestHandler(getMyCartController)
)

cartItemsRouter.post(
  '/checkout',
  accessTokenValidator,
  isVerifiedUserValidator,
  notEmptyCartValidator,
  checkoutValidator,
  wrapRequestHandler(checkoutController)
)

export default cartItemsRouter
