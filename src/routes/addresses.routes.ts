import { Router } from 'express'

import {
  createAddressController,
  deleteAddressController,
  getAddressDetailController,
  getDistrictsController,
  getMyAddressesController,
  getProvincesController,
  getWardsController,
  setDefaultAddressController,
  updateAddressController
} from '~/controllers/addresses.controllers'
import { addressAuthorValidator, addressIdValidator, createAddressValidator } from '~/middlewares/addresses.middlewares'
import { filterReqBodyMiddleware, paginationValidator } from '~/middlewares/common.middlewares'
import { accessTokenValidator, isVerifiedUserValidator } from '~/middlewares/users.middlewares'
import { CreateAddressReqBody } from '~/models/requests/Address.requests'
import { wrapRequestHandler } from '~/utils/handler'

const addressesRouter = Router()

addressesRouter.get('/provinces', wrapRequestHandler(getProvincesController))

addressesRouter.get('/provinces/:provinceId/districts', wrapRequestHandler(getDistrictsController))

addressesRouter.get('/provinces/:provinceId/districts/:districtId/wards', wrapRequestHandler(getWardsController))

addressesRouter.post(
  '/',
  accessTokenValidator,
  isVerifiedUserValidator,
  createAddressValidator,
  filterReqBodyMiddleware<CreateAddressReqBody>([
    'detailAddress',
    'districtId',
    'fullName',
    'phoneNumber',
    'provinceId',
    'type',
    'wardId'
  ]),
  wrapRequestHandler(createAddressController)
)

addressesRouter.put(
  '/:addressId',
  accessTokenValidator,
  isVerifiedUserValidator,
  addressIdValidator,
  addressAuthorValidator,
  createAddressValidator,
  filterReqBodyMiddleware<CreateAddressReqBody>([
    'detailAddress',
    'districtId',
    'fullName',
    'phoneNumber',
    'provinceId',
    'type',
    'wardId'
  ]),
  wrapRequestHandler(updateAddressController)
)

addressesRouter.post(
  '/:addressId/set-default',
  accessTokenValidator,
  isVerifiedUserValidator,
  addressIdValidator,
  addressAuthorValidator,
  wrapRequestHandler(setDefaultAddressController)
)

addressesRouter.get(
  '/me',
  accessTokenValidator,
  isVerifiedUserValidator,
  paginationValidator,
  wrapRequestHandler(getMyAddressesController)
)

addressesRouter.get(
  '/:addressId',
  accessTokenValidator,
  isVerifiedUserValidator,
  addressIdValidator,
  addressAuthorValidator,
  wrapRequestHandler(getAddressDetailController)
)

addressesRouter.delete(
  '/:addressId',
  accessTokenValidator,
  isVerifiedUserValidator,
  addressIdValidator,
  addressAuthorValidator,
  wrapRequestHandler(deleteAddressController)
)

export default addressesRouter
