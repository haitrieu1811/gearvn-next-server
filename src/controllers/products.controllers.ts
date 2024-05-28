import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'

import { PRODUCTS_MESSAGES } from '~/constants/message'
import { CreateProductReqBody, ProductIdReqParams } from '~/models/requests/Product.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import productService from '~/services/products.services'

export const createProductController = async (
  req: Request<ParamsDictionary, any, CreateProductReqBody>,
  res: Response
) => {
  const { userId, userType } = req.decodedAuthorization as TokenPayload
  const result = await productService.create({
    userId: new ObjectId(userId),
    userType,
    data: req.body
  })
  return res.json({
    message: PRODUCTS_MESSAGES.CREATE_PRODUCT_SUCCESS,
    data: result
  })
}

export const updateProductController = async (
  req: Request<ProductIdReqParams, any, CreateProductReqBody>,
  res: Response
) => {
  const result = await productService.update({
    data: req.body,
    productId: new ObjectId(req.params.productId)
  })
  return res.json({
    message: PRODUCTS_MESSAGES.UPDATE_PRODUCT_SUCCESS,
    data: result
  })
}
