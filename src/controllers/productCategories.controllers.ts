import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'

import { PRODUCT_CATEGORY_MESSAGES } from '~/constants/message'
import { PaginationReqQuery } from '~/models/requests/Common.requests'
import {
  CreateProductCategoryReqBody,
  ProductCategoryIdReqParams,
  UpdateProductCategoryReqBody
} from '~/models/requests/ProductCategory.requests'
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

export const updateProductCategoryController = async (
  req: Request<ProductCategoryIdReqParams, any, UpdateProductCategoryReqBody>,
  res: Response
) => {
  const result = await productCategoryService.update({
    data: req.body,
    productCategoryId: new ObjectId(req.params.productCategoryId)
  })
  return res.json({
    message: PRODUCT_CATEGORY_MESSAGES.UPDATE_PRODUCT_CATEGORY_SUCCESS,
    data: result
  })
}

export const getProductCategoriesController = async (
  req: Request<ParamsDictionary, any, any, PaginationReqQuery>,
  res: Response
) => {
  const { productCategories, ...pagination } = await productCategoryService.findMany(req.query)
  return res.json({
    message: PRODUCT_CATEGORY_MESSAGES.GET_PRODUCT_CATEGORIES_SUCCESS,
    data: {
      productCategories,
      pagination
    }
  })
}

export const getAllProductCategoriesController = async (
  req: Request<ParamsDictionary, any, any, PaginationReqQuery>,
  res: Response
) => {
  const { productCategories, ...pagination } = await productCategoryService.findAll(req.query)
  return res.json({
    message: PRODUCT_CATEGORY_MESSAGES.GET_ALL_PRODUCT_CATEGORIES_SUCCESS,
    data: {
      productCategories,
      pagination
    }
  })
}

export const getProductCategoryDetailController = async (req: Request<ProductCategoryIdReqParams>, res: Response) => {
  const result = await productCategoryService.findById(new ObjectId(req.params.productCategoryId))
  return res.json({
    message: PRODUCT_CATEGORY_MESSAGES.GET_PRODUCT_CATEGORY_DETAIL_SUCCESS,
    data: result
  })
}
