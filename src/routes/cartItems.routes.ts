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

cartItemsRouter.get(
  '/me',
  accessTokenValidator,
  isVerifiedUserValidator,
  isCustomerValidator,
  paginationValidator,
  wrapRequestHandler(getMyCartController)
)

cartItemsRouter.post(
  '/checkout',
  accessTokenValidator,
  isVerifiedUserValidator,
  isCustomerValidator,
  notEmptyCartValidator,
  checkoutValidator,
  wrapRequestHandler(checkoutController)
)

export default cartItemsRouter
