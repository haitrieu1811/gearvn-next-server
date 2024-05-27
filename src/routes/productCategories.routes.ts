import { Router } from 'express'

import { createProductCategoryController } from '~/controllers/productCategories.controllers'
import { filterReqBodyMiddleware } from '~/middlewares/common.middlewares'
import { createProductCategoryValidator } from '~/middlewares/productCategories.middlewares'
import { accessTokenValidator, isAdminValidator, isVerifiedUserValidator } from '~/middlewares/users.middlewares'
import { CreateProductCategoryReqBody } from '~/models/requests/ProductCategory.requests'
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

export default productCategoriesRouter
