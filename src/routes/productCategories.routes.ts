import { Router } from 'express'

import {
  createProductCategoryController,
  updateProductCategoryController
} from '~/controllers/productCategories.controllers'
import { filterReqBodyMiddleware } from '~/middlewares/common.middlewares'
import {
  createProductCategoryValidator,
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

export default productCategoriesRouter
