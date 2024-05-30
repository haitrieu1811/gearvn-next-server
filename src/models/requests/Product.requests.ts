import { ParamsDictionary } from 'express-serve-static-core'

import { ProductApprovalStatus, ProductStatus } from '~/constants/enum'
import { PaginationReqQuery } from '~/models/requests/Common.requests'

export type CreateProductReqBody = {
  productCategoryId: string
  brandId: string
  name: string
  originalPrice: number
  priceAfterDiscount?: number
  shortDescription?: string
  description?: string
  photos: string[]
  thumbnail: string
  orderNumber?: number
  specifications?: {
    key: string
    value: string
  }[]
  status?: ProductStatus
  approvalStatus?: ProductApprovalStatus
}

export type ProductIdReqParams = ParamsDictionary & {
  productId: string
}

export type GetProductsReqQuery = PaginationReqQuery & {
  categoryId?: string
  brandId?: string
  name?: string
  lowestPrice?: string
  highestPrice?: string
}
