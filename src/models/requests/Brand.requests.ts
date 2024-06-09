import { ParamsDictionary } from 'express-serve-static-core'

import { BrandStatus } from '~/constants/enum'

export type CreateBrandReqBody = {
  thumbnail: string
  name: string
  description?: string
  status?: BrandStatus
  orderNumber?: number
}

export type UpdateBrandReqBody = Partial<CreateBrandReqBody>

export type BrandIdReqParams = ParamsDictionary & {
  brandId: string
}
