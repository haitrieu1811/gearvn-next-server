import { Router } from 'express'

import {
  createProductController,
  deleteProductController,
  getAllProductsController,
  getProductDetailController,
  getProductsController,
  updateProductController
} from '~/controllers/products.controllers'
import { filterReqBodyMiddleware, paginationValidator } from '~/middlewares/common.middlewares'
import {
  createProductRoleValidator,
  createProductValidator,
  deleteProductRoleValidator,
  getAllProductsRoleValidator,
  getProductsValidator,
  productIdValidator,
  updateProductRoleValidator
} from '~/middlewares/products.middlewares'
import { accessTokenValidator, isVerifiedUserValidator } from '~/middlewares/users.middlewares'
import { CreateProductReqBody } from '~/models/requests/Product.requests'
import { wrapRequestHandler } from '~/utils/handler'

const productsRouter = Router()

productsRouter.post(
  '/',
  accessTokenValidator,
  isVerifiedUserValidator,
  createProductRoleValidator,
  createProductValidator,
  filterReqBodyMiddleware<CreateProductReqBody>([
    'approvalStatus',
    'brandId',
    'description',
    'name',
    'orderNumber',
    'originalPrice',
    'photos',
    'priceAfterDiscount',
    'productCategoryId',
    'shortDescription',
    'specifications',
    'status',
    'thumbnail'
  ]),
  wrapRequestHandler(createProductController)
)

productsRouter.put(
  '/:productId',
  accessTokenValidator,
  isVerifiedUserValidator,
  updateProductRoleValidator,
  productIdValidator,
  createProductValidator,
  filterReqBodyMiddleware<CreateProductReqBody>([
    'approvalStatus',
    'brandId',
    'description',
    'name',
    'orderNumber',
    'originalPrice',
    'photos',
    'priceAfterDiscount',
    'productCategoryId',
    'shortDescription',
    'specifications',
    'status',
    'thumbnail'
  ]),
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

productsRouter.get('/', getProductsValidator, paginationValidator, wrapRequestHandler(getProductsController))

productsRouter.get(
  '/all',
  accessTokenValidator,
  getAllProductsRoleValidator,
  getProductsValidator,
  paginationValidator,
  wrapRequestHandler(getAllProductsController)
)

productsRouter.get('/:productId/for-read', productIdValidator, wrapRequestHandler(getProductDetailController))

export default productsRouter
