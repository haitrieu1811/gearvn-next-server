import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'

import { PRODUCTS_MESSAGES } from '~/constants/message'
import { CreateProductReqBody } from '~/models/requests/Product.requests'
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
