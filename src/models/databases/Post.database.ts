import { ObjectId } from 'mongodb'

import { PostApprovalStatus, PostStatus } from '~/constants/enum'

type PostConstructor = {
  _id?: ObjectId
  userId: ObjectId
  title: string
  content: string
  description: string
  thumbnail: ObjectId
  orderNumber?: number
  status?: PostStatus
  approvalStatus?: PostApprovalStatus
  createdAt?: Date
  updatedAt?: Date
}

export default class Post {
  _id?: ObjectId
  userId: ObjectId
  title: string
  content: string
  description: string
  thumbnail: ObjectId
  orderNumber: number
  status: PostStatus
  approvalStatus: PostApprovalStatus
  createdAt: Date
  updatedAt: Date

  constructor({
    _id,
    userId,
    title,
    content,
    description,
    thumbnail,
    orderNumber,
    status,
    approvalStatus,
    createdAt,
    updatedAt
  }: PostConstructor) {
    const date = new Date()
    this._id = _id
    this.userId = userId
    this.title = title
    this.content = content
    this.description = description
    this.thumbnail = thumbnail
    this.orderNumber = orderNumber || 0
    this.status = status || PostStatus.Active
    this.approvalStatus = approvalStatus !== undefined ? approvalStatus : PostApprovalStatus.Unapproved
    this.createdAt = createdAt || date
    this.updatedAt = updatedAt || date
  }
}
