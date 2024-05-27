import { ObjectId } from 'mongodb'

import { BrandStatus } from '~/constants/enum'

type BrandConstructor = {
  _id?: ObjectId
  userId: ObjectId
  thumbnail: ObjectId
  name: string
  description?: string
  status?: BrandStatus
  orderNumber?: number
  createdAt?: Date
  updatedAt?: Date
}

export default class Brand {
  _id?: ObjectId
  userId: ObjectId
  thumbnail: ObjectId
  name: string
  description: string
  status: BrandStatus
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
  }: BrandConstructor) {
    const date = new Date()
    this._id = _id
    this.userId = userId
    this.thumbnail = thumbnail
    this.name = name
    this.description = description || ''
    this.status = status || BrandStatus.Active
    this.orderNumber = orderNumber || 0
    this.createdAt = createdAt || date
    this.updatedAt = updatedAt || date
  }
}
