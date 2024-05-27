import { ObjectId } from 'mongodb'

import { ProductCategoryStatus } from '~/constants/enum'

type ProductCategoryConstructor = {
  _id?: ObjectId
  userId: ObjectId
  thumbnail: ObjectId
  name: string
  description?: string
  status?: ProductCategoryStatus
  orderNumber?: number
  createdAt?: Date
  updatedAt?: Date
}

export default class ProductCategory {
  _id?: ObjectId
  userId: ObjectId
  thumbnail: ObjectId
  name: string
  description: string
  status: ProductCategoryStatus
  orderNumber: number
  createdAt: Date
  updatedAt: Date

  constructor({
    _id,
    userId,
    thumbnail,
    name,
    description,
    status,
    orderNumber,
    createdAt,
    updatedAt
  }: ProductCategoryConstructor) {
    const date = new Date()
    this._id = _id
    this.userId = userId
    this.thumbnail = thumbnail
    this.name = name
    this.description = description || ''
    this.status = status || ProductCategoryStatus.Active
    this.orderNumber = orderNumber || 0
    this.createdAt = createdAt || date
    this.updatedAt = updatedAt || date
  }
}
