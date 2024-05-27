import { ParamsDictionary } from 'express-serve-static-core'

import { ProductCategoryStatus } from '~/constants/enum'

export type CreateProductCategoryReqBody = {
  thumbnail: string
  name: string
  description?: string
  status?: ProductCategoryStatus
  orderNumber?: number
}

export type UpdateProductCategoryReqBody = {
  thumbnail?: string
  name?: string
  description?: string
  status?: ProductCategoryStatus
  orderNumber?: number
}

export type ProductCategoryIdReqParams = ParamsDictionary & {
  productCategoryId: string
}
