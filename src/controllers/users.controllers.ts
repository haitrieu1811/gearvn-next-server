import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId, WithId } from 'mongodb'

import { USERS_MESSAGES } from '~/constants/message'
import User from '~/models/databases/User.database'
import { LogoutReqBody, RefreshTokenReqBody, RegisterReqBody, TokenPayload } from '~/models/requests/User.requests'
import userService from '~/services/users.services'

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  const result = await userService.register(req.body)
  return res.json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    data: result
  })
}

export const loginController = async (req: Request, res: Response) => {
  const result = await userService.login(req.user as WithId<User>)
  return res.json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    data: result
  })
}

export const logoutController = async (req: Request<ParamsDictionary, any, LogoutReqBody>, res: Response) => {
  await userService.logout(req.body.refreshToken)
  return res.json({
    message: USERS_MESSAGES.LOGOUT_SUCCESS
  })
}

export const refreshTokenController = async (
  req: Request<ParamsDictionary, any, RefreshTokenReqBody>,
  res: Response
) => {
  const decodedRefreshToken = req.decodedRefreshToken as TokenPayload
  const result = await userService.refreshToken({
    ...decodedRefreshToken,
    refreshToken: req.body.refreshToken,
    refreshTokenExp: decodedRefreshToken.exp
  })
  return res.json({
    message: USERS_MESSAGES.REFRESH_TOKEN_SUCCESS,
    data: result
  })
}

export const resendEmailVerifyController = async (req: Request, res: Response) => {
  const { userId } = req.decodedAuthorization as TokenPayload
  await userService.resendEmailVerify(new ObjectId(userId))
  return res.json({
    message: USERS_MESSAGES.RESEND_EMAIL_VERIFY_SUCCESS
  })
}

export const verifyEmailController = async (req: Request, res: Response) => {
  const { userId } = req.decodedVerifyEmailToken as TokenPayload
  const result = await userService.verifyEmail(new ObjectId(userId))
  return res.json({
    message: USERS_MESSAGES.EMAIL_VERIFICATION_SUCCESS,
    data: result
  })
}
