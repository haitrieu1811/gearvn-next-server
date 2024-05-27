import { Router } from 'express'

import {
  createBrandController,
  deleteBrandController,
  getAllbrandsController,
  getBrandDetailController,
  getbrandsController,
  updateBrandController
} from '~/controllers/brands.controllers'
import { brandIdValidator, createBrandValidator, updateBrandValidator } from '~/middlewares/brands.middlewares'
import { filterReqBodyMiddleware, paginationValidator } from '~/middlewares/common.middlewares'
import { accessTokenValidator, isAdminValidator, isVerifiedUserValidator } from '~/middlewares/users.middlewares'
import { CreateBrandReqBody, UpdateBrandReqBody } from '~/models/requests/Brand.requests'
import { wrapRequestHandler } from '~/utils/handler'

const brandsRouter = Router()

brandsRouter.post(
  '/',
  accessTokenValidator,
  isVerifiedUserValidator,
  isAdminValidator,
  createBrandValidator,
  filterReqBodyMiddleware<CreateBrandReqBody>(['description', 'name', 'orderNumber', 'status', 'thumbnail']),
  wrapRequestHandler(createBrandController)
)

brandsRouter.patch(
  '/:brandId',
  accessTokenValidator,
  isVerifiedUserValidator,
  isAdminValidator,
  brandIdValidator,
  updateBrandValidator,
  filterReqBodyMiddleware<UpdateBrandReqBody>(['description', 'name', 'orderNumber', 'status', 'thumbnail']),
  wrapRequestHandler(updateBrandController)
)

brandsRouter.get('/', paginationValidator, wrapRequestHandler(getbrandsController))

brandsRouter.get(
  '/all',
  accessTokenValidator,
  isVerifiedUserValidator,
  isAdminValidator,
  paginationValidator,
  wrapRequestHandler(getAllbrandsController)
)

brandsRouter.get(
  '/:brandId',
  accessTokenValidator,
  isVerifiedUserValidator,
  isAdminValidator,
  brandIdValidator,
  wrapRequestHandler(getBrandDetailController)
)

brandsRouter.delete(
  '/:brandId',
  accessTokenValidator,
  isVerifiedUserValidator,
  isAdminValidator,
  brandIdValidator,
  wrapRequestHandler(deleteBrandController)
)

export default brandsRouter
