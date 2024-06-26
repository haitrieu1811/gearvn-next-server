import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId, WithId } from 'mongodb'

import { USERS_MESSAGES } from '~/constants/message'
import User from '~/models/databases/User.database'
import {
  ChangePasswordReqBody,
  CreateUserReqBody,
  GetAllUsersReqQuery,
  LogoutReqBody,
  RefreshTokenReqBody,
  RegisterReqBody,
  ResetPasswordReqBody,
  TokenPayload,
  UpdateMeReqBody,
  UserIdReqParams
} from '~/models/requests/User.requests'
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

export const forgotPasswordController = async (req: Request, res: Response) => {
  const user = req.user as WithId<User>
  const { _id, email } = user
  await userService.forgotPassword({
    userId: _id,
    email
  })
  return res.json({
    message: USERS_MESSAGES.FORGOT_PASSWORD_SUCCESS
  })
}

export const resetPasswordController = async (
  req: Request<ParamsDictionary, any, ResetPasswordReqBody>,
  res: Response
) => {
  const { userId } = req.decodedForgotPasswordToken as TokenPayload
  const result = await userService.resetPassword({
    password: req.body.password,
    userId: new ObjectId(userId)
  })
  return res.json({
    message: USERS_MESSAGES.RESET_PASSWORD_SUCCESS,
    data: result
  })
}

export const changePasswordController = async (
  req: Request<ParamsDictionary, any, ChangePasswordReqBody>,
  res: Response
) => {
  const { userId } = req.decodedAuthorization as TokenPayload
  await userService.changePassword({
    password: req.body.password,
    userId: new ObjectId(userId)
  })
  return res.json({
    message: USERS_MESSAGES.CHANGE_PASSWORD_SUCCESS
  })
}

export const updateMeController = async (req: Request<ParamsDictionary, any, UpdateMeReqBody>, res: Response) => {
  const { userId } = req.decodedAuthorization as TokenPayload
  const result = await userService.updateMe({
    data: req.body,
    userId: new ObjectId(userId)
  })
  return res.json({
    message: USERS_MESSAGES.UPDATE_ME_SUCCESS,
    data: result
  })
}

export const getMeController = async (req: Request, res: Response) => {
  const { userId } = req.decodedAuthorization as TokenPayload
  const result = await userService.getMe(new ObjectId(userId))
  return res.json({
    message: USERS_MESSAGES.GET_ME_SUCCESS,
    data: result
  })
}

export const getAllUsersController = async (
  req: Request<ParamsDictionary, any, any, GetAllUsersReqQuery>,
  res: Response
) => {
  const { users, analytics, ...pagination } = await userService.getAllUsers(req.query)
  return res.json({
    message: USERS_MESSAGES.GET_ALL_USERS_SUCCESS,
    data: {
      users,
      analytics,
      pagination
    }
  })
}

export const createUserController = async (req: Request<ParamsDictionary, any, CreateUserReqBody>, res: Response) => {
  const result = await userService.createUser(req.body)
  return res.json({
    message: USERS_MESSAGES.CREATE_USER_SUCCESS,
    data: result
  })
}

export const getUserByIdController = async (req: Request<UserIdReqParams>, res: Response) => {
  const result = await userService.getUserById(new ObjectId(req.params.userId))
  return res.json({
    message: USERS_MESSAGES.GET_USER_SUCCESS,
    data: result
  })
}
