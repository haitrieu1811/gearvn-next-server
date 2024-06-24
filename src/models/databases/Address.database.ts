import { ObjectId } from 'mongodb'

import { AddressType } from '~/constants/enum'

type AddressConstructor = {
  _id?: ObjectId
  userId: ObjectId
  provinceId: ObjectId
  districtId: string
  wardId: string
  detailAddress: string
  type: AddressType
  fullName: string
  phoneNumber: string
  createdAt?: Date
  updatedAt?: Date
}

export default class Address {
  _id?: ObjectId
  userId: ObjectId
  provinceId: ObjectId
  districtId: string
  wardId: string
  detailAddress: string
  type: AddressType
  fullName: string
  phoneNumber: string
  createdAt: Date
  updatedAt: Date

  constructor({
    _id,
    userId,
    provinceId,
    districtId,
    wardId,
    detailAddress,
    type,
    fullName,
    phoneNumber,
    createdAt,
    updatedAt
  }: AddressConstructor) {
    const date = new Date()
    this._id = _id
    this.userId = userId
    this.provinceId = provinceId
    this.districtId = districtId
    this.wardId = wardId
    this.detailAddress = detailAddress
    this.type = type
    this.fullName = fullName
    this.phoneNumber = phoneNumber
    this.createdAt = createdAt || date
    this.updatedAt = updatedAt || date
  }
}
