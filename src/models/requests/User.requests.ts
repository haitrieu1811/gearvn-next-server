import { Gender, UserStatus, UserType, UserVerifyStatus } from '~/constants/enum'

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
