import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'

import { ROLES_MESSAGES } from '~/constants/message'
import { CreateRoleReqBody } from '~/models/requests/Role.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import roleService from '~/services/roles.services'

export const createRoleController = async (req: Request<ParamsDictionary, any, CreateRoleReqBody>, res: Response) => {
  const { userId } = req.decodedAuthorization as TokenPayload
  const result = await roleService.create({ data: req.body, userId: new ObjectId(userId) })
  return res.json({
    message: ROLES_MESSAGES.CREATE_ROLE_SUCCESS,
    data: result
  })
}
