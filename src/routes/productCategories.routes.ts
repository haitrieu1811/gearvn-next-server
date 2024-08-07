import { Router } from 'express'

import {
  createProductCategoryController,
  deleteProductCategoryController,
  getAllProductCategoriesController,
  getProductCategoriesController,
  getProductCategoryDetailController,
  updateProductCategoryController
} from '~/controllers/productCategories.controllers'
import { filterReqBodyMiddleware, paginationValidator } from '~/middlewares/common.middlewares'
import {
  createProductCategoryValidator,
  isEmptyProductCategoryValidator,
  productCategoryIdValidator,
  updateProductCategoryValidator
} from '~/middlewares/productCategories.middlewares'
import { accessTokenValidator, isAdminValidator, isVerifiedUserValidator } from '~/middlewares/users.middlewares'
import { CreateProductCategoryReqBody, UpdateProductCategoryReqBody } from '~/models/requests/ProductCategory.requests'
import { wrapRequestHandler } from '~/utils/handler'

const productCategoriesRouter = Router()

productCategoriesRouter.post(
  '/',
  accessTokenValidator,
  isVerifiedUserValidator,
  isAdminValidator,
  createProductCategoryValidator,
  filterReqBodyMiddleware<CreateProductCategoryReqBody>(['description', 'name', 'orderNumber', 'status', 'thumbnail']),
  wrapRequestHandler(createProductCategoryController)
)

productCategoriesRouter.patch(
  '/:productCategoryId',
  accessTokenValidator,
  isVerifiedUserValidator,
  isAdminValidator,
  productCategoryIdValidator,
  updateProductCategoryValidator,
  filterReqBodyMiddleware<UpdateProductCategoryReqBody>(['description', 'name', 'orderNumber', 'status', 'thumbnail']),
  wrapRequestHandler(updateProductCategoryController)
)

productCategoriesRouter.get('/', paginationValidator, wrapRequestHandler(getProductCategoriesController))

productCategoriesRouter.get(
  '/all',
  accessTokenValidator,
  isVerifiedUserValidator,
  isAdminValidator,
  paginationValidator,
  wrapRequestHandler(getAllProductCategoriesController)
)

productCategoriesRouter.get(
  '/:productCategoryId',
  productCategoryIdValidator,
  wrapRequestHandler(getProductCategoryDetailController)
)

productCategoriesRouter.delete(
  '/:productCategoryId',
  accessTokenValidator,
  isVerifiedUserValidator,
  isAdminValidator,
  productCategoryIdValidator,
  isEmptyProductCategoryValidator,
  wrapRequestHandler(deleteProductCategoryController)
)

export default productCategoriesRouter
