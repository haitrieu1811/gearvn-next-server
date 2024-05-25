import { ObjectId } from 'mongodb'

import { RoleField, RoleType } from '~/constants/enum'

type RoleConstructor = {
  _id?: ObjectId
  type: RoleType
  field: RoleField
  viName: string
  enName: string
  viDescription?: string
  enDescription?: string
  createdAt?: Date
  updatedAt?: Date
}

export default class Role {
  _id?: ObjectId
  type: RoleType
  field: RoleField
  viName: string
  enName: string
  viDescription: string
  enDescription: string
  createdAt: Date
  updatedAt: Date

  constructor({
    _id,
    type,
    field,
    viName,
    enName,
    viDescription,
    enDescription,
    createdAt,
    updatedAt
  }: RoleConstructor) {
    const date = new Date()
    this._id = _id
    this.type = type
    this.field = field
    this.viName = viName
    this.enName = enName
    this.viDescription = viDescription || ''
    this.enDescription = enDescription || ''
    this.createdAt = createdAt || date
    this.updatedAt = updatedAt || date
  }
}
