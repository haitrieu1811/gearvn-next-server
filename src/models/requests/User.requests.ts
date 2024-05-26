import { Gender, UserStatus, UserType, UserVerifyStatus } from '~/constants/enum'
import { PaginationReqQuery } from '~/models/requests/Common.requests'

export type TokenPayload = {
  userId: string
  userType: UserType
  userStatus: UserStatus
  userVerifyStatus: UserVerifyStatus
  iat: number
  exp: number
}

export type RegisterReqBody = {
  email: string
  fullName: string
  password: string
}

export type LogoutReqBody = {
  refreshToken: string
}

export type RefreshTokenReqBody = {
  refreshToken: string
}

export type ResetPasswordReqBody = {
  password: string
}

export type ChangePasswordReqBody = {
  password: string
}

export type UpdateMeReqBody = {
  fullName?: string
  avatar?: string
  gender?: Gender
  phoneNumber?: string
}

export type GetAllUsersReqQuery = PaginationReqQuery & {
  type?: UserType
  gender?: Gender
  status?: UserStatus
  verify?: UserVerifyStatus
}
