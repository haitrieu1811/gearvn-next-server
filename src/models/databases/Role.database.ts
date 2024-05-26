import { ObjectId } from 'mongodb'

import { RoleField, RoleType } from '~/constants/enum'

type RoleConstructor = {
  _id?: ObjectId
  userId: ObjectId
  type: RoleType
  field: RoleField
  name: string
  description?: string
  createdAt?: Date
  updatedAt?: Date
}

export default class Role {
  _id?: ObjectId
  userId: ObjectId
  type: RoleType
  field: RoleField
  name: string
  description: string
  createdAt: Date
  updatedAt: Date

  constructor({ _id, userId, type, field, name, description, createdAt, updatedAt }: RoleConstructor) {
    const date = new Date()
    this._id = _id
    this.userId = userId
    this.type = type
    this.field = field
    this.name = name
    this.description = description || ''
    this.createdAt = createdAt || date
    this.updatedAt = updatedAt || date
  }
}
