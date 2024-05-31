import { ObjectId } from 'mongodb'

export type StarPointType = 1 | 2 | 3 | 4 | 5

type ReviewConstructor = {
  _id?: ObjectId
  userId: ObjectId
  productId: ObjectId
  parentId?: ObjectId
  starPoint?: StarPointType
  content?: string
  photos?: ObjectId[]
  createdAt?: Date
  updatedAt?: Date
}

export default class Review {
  _id?: ObjectId
  userId: ObjectId
  productId: ObjectId
  parentId: ObjectId | null
  starPoint: StarPointType | null
  content: string
  photos: ObjectId[]
  createdAt: Date
  updatedAt: Date

  constructor({
    _id,
    productId,
    userId,
    parentId,
    starPoint,
    content,
    photos,
    createdAt,
    updatedAt
  }: ReviewConstructor) {
    const date = new Date()
    this._id = _id
    this.productId = productId
    this.userId = userId
    this.parentId = parentId || null
    this.starPoint = starPoint || null
    this.content = content || ''
    this.photos = photos || []
    this.createdAt = createdAt || date
    this.updatedAt = updatedAt || date
  }
}
