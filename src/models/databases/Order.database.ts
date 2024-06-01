import { ObjectId } from 'mongodb'

import { OrderStatus, PaymentMethod } from '~/constants/enum'

type OrderConstructor = {
  _id?: ObjectId
  userId: ObjectId
  cartItems: ObjectId[]
  totalItems: number
  totalAmount: number
  totalAmountReduced?: number
  fullName: string
  phoneNumber: string
  provinceId: ObjectId
  districtId: string
  wardId: string
  streetId: string
  detailAddress: string
  paymentMethod: PaymentMethod
  status?: OrderStatus
  createdAt?: Date
  updatedAt?: Date
}

export default class Order {
  _id?: ObjectId
  userId: ObjectId
  cartItems: ObjectId[]
  totalItems: number
  totalAmount: number
  totalAmountReduced: number
  fullName: string
  phoneNumber: string
  provinceId: ObjectId
  districtId: string
  wardId: string
  streetId: string
  detailAddress: string
  paymentMethod: PaymentMethod
  status: OrderStatus
  createdAt: Date
  updatedAt: Date

  constructor({
    _id,
    userId,
    cartItems,
    totalItems,
    totalAmount,
    totalAmountReduced,
    fullName,
    phoneNumber,
    provinceId,
    districtId,
    wardId,
    streetId,
    detailAddress,
    paymentMethod,
    status,
    createdAt,
    updatedAt
  }: OrderConstructor) {
    const date = new Date()
    this._id = _id
    this.userId = userId
    this.cartItems = cartItems
    this.totalItems = totalItems
    this.totalAmount = totalAmount
    this.totalAmountReduced = totalAmountReduced || 0
    this.fullName = fullName
    this.phoneNumber = phoneNumber
    this.provinceId = provinceId
    this.districtId = districtId
    this.wardId = wardId
    this.streetId = streetId
    this.detailAddress = detailAddress
    this.paymentMethod = paymentMethod
    this.status = status || OrderStatus.WaitForConfirmation
    this.createdAt = createdAt || date
    this.updatedAt = updatedAt || date
  }
}
