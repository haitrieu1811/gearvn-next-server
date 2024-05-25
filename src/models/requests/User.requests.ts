import { UserStatus, UserType, UserVerifyStatus } from '~/constants/enum'

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
