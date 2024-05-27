import { ParamsDictionary } from 'express-serve-static-core'

import { AddressType } from '~/constants/enum'

export type AddressIdReqParams = ParamsDictionary & {
  addressId: string
}

export type ProvinceIdReqParams = ParamsDictionary & {
  provinceId: string
}

export type DistrictIdReqParams = ParamsDictionary & {
  districtId: string
}

export type CreateAddressReqBody = {
  provinceId: string
  districtId: string
  wardId: string
  streetId: string
  addressDetail: string
  type: AddressType
  fullName: string
  phoneNumber: string
}
