import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'

import { PRODUCT_CATEGORY_MESSAGES } from '~/constants/message'
import { CreateProductCategoryReqBody } from '~/models/requests/ProductCategory.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import productCategoryService from '~/services/productCategories.services'

export const createProductCategoryController = async (
  req: Request<ParamsDictionary, any, CreateProductCategoryReqBody>,
  res: Response
) => {
  const { userId } = req.decodedAuthorization as TokenPayload
  const result = await productCategoryService.create({ data: req.body, userId: new ObjectId(userId) })
  return res.json({
    message: PRODUCT_CATEGORY_MESSAGES.CREATE_PRODUCT_CATEGORY_SUCCESS,
    data: result
  })
}
