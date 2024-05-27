import { ProductCategoryStatus } from '~/constants/enum'

export type CreateProductCategoryReqBody = {
  thumbnail: string
  name: string
  description?: string
  status?: ProductCategoryStatus
  orderNumber?: number
}
