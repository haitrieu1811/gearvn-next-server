import { Router } from 'express'

import {
  createAddressController,
  getDistrictsController,
  getProvincesController,
  getStreetsController,
  getWardsController,
  updateAddressController
} from '~/controllers/addresses.controllers'
import { addressAuthorValidator, addressIdValidator, createAddressValidator } from '~/middlewares/addresses.middlewares'
import { filterReqBodyMiddleware } from '~/middlewares/common.middlewares'
import { accessTokenValidator, isVerifiedUserValidator } from '~/middlewares/users.middlewares'
import { CreateAddressReqBody } from '~/models/requests/Address.requests'
import { wrapRequestHandler } from '~/utils/handler'

const addressesRouter = Router()

addressesRouter.get('/provinces', wrapRequestHandler(getProvincesController))

addressesRouter.get('/provinces/:provinceId/districts', wrapRequestHandler(getDistrictsController))

addressesRouter.get('/provinces/:provinceId/districts/:districtId/wards', wrapRequestHandler(getWardsController))

addressesRouter.get('/provinces/:provinceId/districts/:districtId/streets', wrapRequestHandler(getStreetsController))

addressesRouter.post(
  '/',
  accessTokenValidator,
  isVerifiedUserValidator,
  createAddressValidator,
  filterReqBodyMiddleware<CreateAddressReqBody>([
    'addressDetail',
    'districtId',
    'fullName',
    'phoneNumber',
    'provinceId',
    'streetId',
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
    'addressDetail',
    'districtId',
    'fullName',
    'phoneNumber',
    'provinceId',
    'streetId',
    'type',
    'wardId'
  ]),
  wrapRequestHandler(updateAddressController)
)

export default addressesRouter
