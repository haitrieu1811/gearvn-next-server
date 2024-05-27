import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'

import { ADDRESS_MESSAGES } from '~/constants/message'
import { CreateAddressReqBody, DistrictIdReqParams, ProvinceIdReqParams } from '~/models/requests/Address.requests'
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

export const getStreetsController = async (req: Request<ProvinceIdReqParams & DistrictIdReqParams>, res: Response) => {
  const { provinceId, districtId } = req.params
  const result = await addressService.getStreetsByProvinceAndDistrictId({ provinceId, districtId })
  return res.json({
    message: ADDRESS_MESSAGES.GET_STREETS_SUCCESS,
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
