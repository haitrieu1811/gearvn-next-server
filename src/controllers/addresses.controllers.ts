import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'

import { ADDRESS_MESSAGES } from '~/constants/message'
import {
  AddressIdReqParams,
  CreateAddressReqBody,
  DistrictIdReqParams,
  ProvinceIdReqParams
} from '~/models/requests/Address.requests'
import { PaginationReqQuery } from '~/models/requests/Common.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import addressService from '~/services/addresses.services'

export const getProvincesController = async (req: Request, res: Response) => {
  const result = await addressService.getAllProvinces()
  return res.json({
    message: ADDRESS_MESSAGES.GET_ALL_PROVINCES_SUCCESS,
    data: result
  })
}

export const getDistrictsController = async (req: Request<ProvinceIdReqParams>, res: Response) => {
  const result = await addressService.getDistrictsByProvinceId(req.params.provinceId)
  return res.json({
    message: ADDRESS_MESSAGES.GET_DISTRICTS_SUCCESS,
    data: result
  })
}

export const getWardsController = async (req: Request<ProvinceIdReqParams & DistrictIdReqParams>, res: Response) => {
  const { provinceId, districtId } = req.params
  const result = await addressService.getWardsByProvinceAndDistrictId({ provinceId, districtId })
  return res.json({
    message: ADDRESS_MESSAGES.GET_WARDS_SUCCESS,
    data: result
  })
}

export const createAddressController = async (
  req: Request<ParamsDictionary, any, CreateAddressReqBody>,
  res: Response
) => {
  const { userId } = req.decodedAuthorization as TokenPayload
  const result = await addressService.create({ data: req.body, userId: new ObjectId(userId) })
  return res.json({
    message: ADDRESS_MESSAGES.CREATE_ADDRESS_SUCCESS,
    data: result
  })
}

export const updateAddressController = async (
  req: Request<AddressIdReqParams, any, CreateAddressReqBody>,
  res: Response
) => {
  const result = await addressService.update({ data: req.body, addressId: new ObjectId(req.params.addressId) })
  return res.json({
    message: ADDRESS_MESSAGES.UPDATE_ADDRESS_SUCCESS,
    data: result
  })
}

export const setDefaultAddressController = async (req: Request<AddressIdReqParams>, res: Response) => {
  const { userId } = req.decodedAuthorization as TokenPayload
  await addressService.setDefault({
    addressId: new ObjectId(req.params.addressId),
    userId: new ObjectId(userId)
  })
  return res.json({
    message: ADDRESS_MESSAGES.SET_DEFAULT_ADDRESS_SUCCESS
  })
}

export const getMyAddressesController = async (
  req: Request<ParamsDictionary, any, any, PaginationReqQuery>,
  res: Response
) => {
  const { userId } = req.decodedAuthorization as TokenPayload
  const { addresses, ...pagination } = await addressService.getMyAddresses({
    userId: new ObjectId(userId),
    query: req.query
  })
  return res.json({
    message: ADDRESS_MESSAGES.GET_MY_ADDRESSES_SUCCESS,
    data: {
      addresses,
      pagination
    }
  })
}

export const getAddressDetailController = async (req: Request<AddressIdReqParams>, res: Response) => {
  const result = await addressService.findById(new ObjectId(req.params.addressId))
  return res.json({
    message: ADDRESS_MESSAGES.GET_ADDRESS_DETAIL_SUCCESS,
    data: result
  })
}

export const deleteAddressController = async (req: Request<AddressIdReqParams>, res: Response) => {
  const { userId } = req.decodedAuthorization as TokenPayload
  await addressService.delete({ addressId: new ObjectId(req.params.addressId), userId: new ObjectId(userId) })
  return res.json({
    message: ADDRESS_MESSAGES.DELETE_ADDRESS_SUCCESS
  })
}
