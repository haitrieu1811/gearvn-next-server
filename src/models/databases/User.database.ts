import { ObjectId } from 'mongodb'

import { Gender, UserStatus, UserType, UserVerifyStatus } from '~/constants/enum'

type UserConstructor = {
  _id?: ObjectId
  email: string
  fullName: string
  password: string
  avatar?: ObjectId
  type?: UserType
  gender?: Gender
  phoneNumber?: string
  addresses?: ObjectId[]
  defaultAddress?: ObjectId
  status?: UserStatus
  verify?: UserVerifyStatus
  verifyEmailToken?: string
  forgotPasswordToken?: string
  createdAt?: Date
  updatedAt?: Date
}

export default class User {
  _id?: ObjectId
  email: string
  fullName: string
  password: string
  avatar: ObjectId | null
  type: UserType
  gender: Gender
  phoneNumber: string
  addresses: ObjectId[]
  defaultAddress: ObjectId | null
  status: UserStatus
  verify: UserVerifyStatus
  verifyEmailToken: string
  forgotPasswordToken: string
  createdAt: Date
  updatedAt: Date

  constructor({
    _id,
    email,
    fullName,
    password,
    avatar,
    type,
    gender,
    phoneNumber,
    addresses,
    defaultAddress,
    status,
    verify,
    verifyEmailToken,
    forgotPasswordToken,
    createdAt,
    updatedAt
  }: UserConstructor) {
    const date = new Date()
    this._id = _id
    this.email = email
    this.fullName = fullName
    this.password = password
    this.avatar = avatar || null
    this.type = type || UserType.Customer
    this.gender = gender || Gender.Male
    this.phoneNumber = phoneNumber || ''
    this.addresses = addresses || []
    this.defaultAddress = defaultAddress || null
    this.status = status || UserStatus.Active
    this.verify = verify || UserVerifyStatus.Unverified
    this.verifyEmailToken = verifyEmailToken || ''
    this.forgotPasswordToken = forgotPasswordToken || ''
    this.createdAt = createdAt || date
    this.updatedAt = updatedAt || date
  }
}
