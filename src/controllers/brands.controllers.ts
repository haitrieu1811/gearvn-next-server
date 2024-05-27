import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'

import { BRANDS_MESSAGES } from '~/constants/message'
import { BrandIdReqParams, CreateBrandReqBody, UpdateBrandReqBody } from '~/models/requests/Brand.requests'
import { PaginationReqQuery } from '~/models/requests/Common.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import brandService from '~/services/brands.services'

export const createBrandController = async (req: Request<ParamsDictionary, any, CreateBrandReqBody>, res: Response) => {
  const { userId } = req.decodedAuthorization as TokenPayload
  const result = await brandService.create({ data: req.body, userId: new ObjectId(userId) })
  return res.json({
    message: BRANDS_MESSAGES.CREATE_BRAND_SUCCESS,
    data: result
  })
}

export const updateBrandController = async (req: Request<BrandIdReqParams, any, UpdateBrandReqBody>, res: Response) => {
  const result = await brandService.update({
    data: req.body,
    brandId: new ObjectId(req.params.brandId)
  })
  return res.json({
    message: BRANDS_MESSAGES.UPDATE_BRAND_SUCCESS,
    data: result
  })
}

export const getbrandsController = async (
  req: Request<ParamsDictionary, any, any, PaginationReqQuery>,
  res: Response
) => {
  const { brands, ...pagination } = await brandService.findMany(req.query)
  return res.json({
    message: BRANDS_MESSAGES.GET_BRANDS_SUCCESS,
    data: {
      brands,
      pagination
    }
  })
}

export const getAllbrandsController = async (
  req: Request<ParamsDictionary, any, any, PaginationReqQuery>,
  res: Response
) => {
  const { brands, ...pagination } = await brandService.findAll(req.query)
  return res.json({
    message: BRANDS_MESSAGES.GET_ALL_BRANDS_SUCCESS,
    data: {
      brands,
      pagination
    }
  })
}

export const getBrandDetailController = async (req: Request<BrandIdReqParams>, res: Response) => {
  const result = await brandService.findById(new ObjectId(req.params.brandId))
  return res.json({
    message: BRANDS_MESSAGES.GET_BRAND_DETAIL_SUCCESS,
    data: result
  })
}

export const deleteBrandController = async (req: Request<BrandIdReqParams>, res: Response) => {
  await brandService.delete(new ObjectId(req.params.brandId))
  return res.json({
    message: BRANDS_MESSAGES.DELETE_BRAND_SUCCESS
  })
}
