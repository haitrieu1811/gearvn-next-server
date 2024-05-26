import { ObjectId } from 'mongodb'

type UserRoleConstructor = {
  _id?: ObjectId
  roleId: ObjectId
  userId: ObjectId
  createdAt?: Date
  updatedAt?: Date
}

export default class UserRole {
  _id?: ObjectId
  roleId: ObjectId
  userId: ObjectId
  createdAt: Date
  updatedAt: Date

  constructor({ _id, roleId, userId, createdAt, updatedAt }: UserRoleConstructor) {
    const date = new Date()
    this._id = _id
    this.roleId = roleId
    this.userId = userId
    this.createdAt = createdAt || date
    this.updatedAt = updatedAt || date
  }
}
