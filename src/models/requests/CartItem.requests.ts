import { ParamsDictionary } from 'express-serve-static-core'

import { PaymentMethod } from '~/constants/enum'

export type AddProductToCartReqBody = {
  quantity: number
}

export type CartItemIdReqParams = ParamsDictionary & {
  cartItemId: string
}

export type UpdateCartItemReqBody = {
  quantity: number
}

export type CheckoutReqBody = {
  fullName: string
  phoneNumber: string
  note?: string
  provinceId: string
  districtId: string
  wardId: string
  detailAddress: string
  paymentMethod: PaymentMethod
}
