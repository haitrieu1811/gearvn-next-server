import { ObjectId } from 'mongodb'

import { ProductApprovalStatus, ProductStatus } from '~/constants/enum'

type ProductSpecificationConstructor = {
  _id?: ObjectId
  key: string
  value: string
  createdAt?: Date
  updatedAt?: Date
}

export class ProductSpecification {
  _id: ObjectId
  key: string
  value: string
  createdAt: Date
  updatedAt: Date

  constructor({ _id, key, value, createdAt, updatedAt }: ProductSpecificationConstructor) {
    const date = new Date()
    this._id = _id || new ObjectId()
    this.key = key
    this.value = value
    this.createdAt = createdAt || date
    this.updatedAt = updatedAt || date
  }
}

type ProductConstructor = {
  _id?: ObjectId
  userId: ObjectId
  productCategoryId: ObjectId
  brandId: ObjectId
  thumbnail: ObjectId
  photos: ObjectId[]
  name: string
  originalPrice: number
  priceAfterDiscount?: number
  shortDescription?: string
  description?: string
  orderNumber?: number
  specifications?: ProductSpecification[]
  status?: ProductStatus
  approvalStatus?: ProductApprovalStatus
  createdAt?: Date
  updatedAt?: Date
}

export default class Product {
  _id?: ObjectId
  userId: ObjectId
  productCategoryId: ObjectId
  brandId: ObjectId
  thumbnail: ObjectId
  photos: ObjectId[]
  name: string
  originalPrice: number
  priceAfterDiscount: number
  shortDescription: string
  description: string
  orderNumber: number
  specifications: ProductSpecification[]
  status: ProductStatus
  approvalStatus: ProductApprovalStatus
  createdAt: Date
  updatedAt: Date

  constructor({
    _id,
    userId,
    productCategoryId,
    brandId,
    name,
    originalPrice,
    priceAfterDiscount,
    shortDescription,
    description,
    photos,
    thumbnail,
    orderNumber,
    specifications,
    status,
    approvalStatus,
    createdAt,
    updatedAt
  }: ProductConstructor) {
    const date = new Date()
    this._id = _id
    this.userId = userId
    this.productCategoryId = productCategoryId
    this.brandId = brandId
    this.name = name
    this.originalPrice = originalPrice
    this.priceAfterDiscount = priceAfterDiscount || originalPrice
    this.shortDescription = shortDescription || ''
    this.description = description || ''
    this.photos = photos
    this.thumbnail = thumbnail
    this.orderNumber = orderNumber || 0
    this.specifications = specifications || []
    this.status = status || ProductStatus.Active
    this.approvalStatus = approvalStatus === undefined ? ProductApprovalStatus.Unapproved : approvalStatus
    this.createdAt = createdAt || date
    this.updatedAt = updatedAt || date
  }
}
