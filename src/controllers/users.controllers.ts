import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

import { USERS_MESSAGES } from '~/constants/message'
import { RegisterReqBody } from '~/models/requests/User.requests'
import userService from '~/services/users.services'

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  const result = await userService.register(req.body)
  return res.json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    data: result
  })
}
