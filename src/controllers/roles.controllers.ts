import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'

import { ROLES_MESSAGES } from '~/constants/message'
import { PaginationReqQuery } from '~/models/requests/Common.requests'
import {
  AssignRoleToUserReqParams,
  CreateRoleReqBody,
  RoleIdReqParams,
  UpdateRoleReqBody
} from '~/models/requests/Role.requests'
import { TokenPayload, UserIdReqParams } from '~/models/requests/User.requests'
import roleService from '~/services/roles.services'

export const createRoleController = async (req: Request<ParamsDictionary, any, CreateRoleReqBody>, res: Response) => {
  const { userId } = req.decodedAuthorization as TokenPayload
  const result = await roleService.create({ data: req.body, userId: new ObjectId(userId) })
  return res.json({
    message: ROLES_MESSAGES.CREATE_ROLE_SUCCESS,
    data: result
  })
}

export const updateRoleController = async (req: Request<RoleIdReqParams, any, UpdateRoleReqBody>, res: Response) => {
  const result = await roleService.update({ data: req.body, roleId: new ObjectId(req.params.roleId) })
  return res.json({
    message: ROLES_MESSAGES.UPDATE_ROLE_SUCCESS,
    data: result
  })
}

export const getAllRolesController = async (
  req: Request<ParamsDictionary, any, any, PaginationReqQuery>,
  res: Response
) => {
  const { roles, ...pagination } = await roleService.findAll(req.query)
  return res.json({
    message: ROLES_MESSAGES.GET_ALL_ROLES_SUCCESS,
    data: {
      roles,
      pagination
    }
  })
}

export const getRoleDetailController = async (req: Request<RoleIdReqParams>, res: Response) => {
  const result = await roleService.findById(new ObjectId(req.params.roleId))
  return res.json({
    message: ROLES_MESSAGES.GET_ROLE_DETAIL_SUCCESS,
    data: result
  })
}

export const assignRoleToUserController = async (req: Request<AssignRoleToUserReqParams>, res: Response) => {
  await roleService.assignRoleToUser({
    roleId: new ObjectId(req.params.roleId),
    userId: new ObjectId(req.params.userId)
  })
  return res.json({
    message: ROLES_MESSAGES.ASSIGN_ROLE_TO_USER_SUCCESS
  })
}

export const unassignRoleOfUserController = async (req: Request<AssignRoleToUserReqParams>, res: Response) => {
  await roleService.unassignRoleOfUser({
    roleId: new ObjectId(req.params.roleId),
    userId: new ObjectId(req.params.userId)
  })
  return res.json({
    message: ROLES_MESSAGES.UNASSIGN_ROLE_TO_USER_SUCCESS
  })
}

export const getPermissionsGroupByUserController = async (
  req: Request<ParamsDictionary, any, any, PaginationReqQuery>,
  res: Response
) => {
  const { permissions, ...pagination } = await roleService.getPermissionsGroupByUser(req.query)
  return res.json({
    message: ROLES_MESSAGES.GET_PERMISSIONS_GROUP_BY_USER_SUCCESS,
    data: {
      permissions,
      pagination
    }
  })
}

export const getPermissionsByUserIdController = async (
  req: Request<UserIdReqParams, any, any, PaginationReqQuery>,
  res: Response
) => {
  const { permissions, ...pagination } = await roleService.getPermissionsByUserId({
    query: req.query,
    userId: new ObjectId(req.params.userId)
  })
  return res.json({
    message: ROLES_MESSAGES.GET_PERMISSIONS_SUCCESS,
    data: {
      permissions,
      pagination
    }
  })
}
