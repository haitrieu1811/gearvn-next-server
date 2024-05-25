import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { WithId } from 'mongodb'

import { USERS_MESSAGES } from '~/constants/message'
import User from '~/models/databases/User.database'
import { LogoutReqBody, RegisterReqBody } from '~/models/requests/User.requests'
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
