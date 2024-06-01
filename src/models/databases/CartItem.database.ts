import { ObjectId } from 'mongodb'

import { CartItemStatus } from '~/constants/enum'

type CartItemConstructor = {
  _id?: ObjectId
  userId: ObjectId
  productId: ObjectId
  unitPrice: number
  quantity: number
  status?: CartItemStatus
  createdAt?: Date
  updatedAt?: Date
}

export default class CartItem {
  _id?: ObjectId
  userId: ObjectId
  productId: ObjectId
  unitPrice: number
  quantity: number
  status: CartItemStatus
  createdAt: Date
  updatedAt: Date

  constructor({ _id, userId, productId, unitPrice, quantity, status, createdAt, updatedAt }: CartItemConstructor) {
    const date = new Date()
    this._id = _id
    this.userId = userId
    this.productId = productId
    this.unitPrice = unitPrice
    this.quantity = quantity
    this.status = status || CartItemStatus.InCart
    this.createdAt = createdAt || date
    this.updatedAt = updatedAt || date
  }
}
