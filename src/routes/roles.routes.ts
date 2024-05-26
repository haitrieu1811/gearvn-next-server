import { Router } from 'express'

import {
  assignRoleToUserController,
  createRoleController,
  getAllRolesController,
  getRoleDetailController,
  updateRoleController
} from '~/controllers/roles.controllers'
import { filterReqBodyMiddleware, paginationValidator } from '~/middlewares/common.middlewares'
import {
  createRoleValidator,
  roleIdValidator,
  roleNotExistValidator,
  updateRoleValidator,
  userRoleNotExistValidator
} from '~/middlewares/roles.middlewares'
import {
  accessTokenValidator,
  isAdminValidator,
  isVerifiedUserValidator,
  userIdValidator
} from '~/middlewares/users.middlewares'
import { UpdateRoleReqBody } from '~/models/requests/Role.requests'
import { wrapRequestHandler } from '~/utils/handler'

const rolesRouter = Router()

rolesRouter.post(
  '/',
  accessTokenValidator,
  isVerifiedUserValidator,
  isAdminValidator,
  createRoleValidator,
  roleNotExistValidator,
  wrapRequestHandler(createRoleController)
)

rolesRouter.patch(
  '/:roleId',
  accessTokenValidator,
  isVerifiedUserValidator,
  isAdminValidator,
  roleIdValidator,
  updateRoleValidator,
  filterReqBodyMiddleware<UpdateRoleReqBody>(['description', 'field', 'name', 'type']),
  wrapRequestHandler(updateRoleController)
)

rolesRouter.get(
  '/all',
  accessTokenValidator,
  isVerifiedUserValidator,
  isAdminValidator,
  paginationValidator,
  wrapRequestHandler(getAllRolesController)
)

rolesRouter.get(
  '/:roleId',
  accessTokenValidator,
  isVerifiedUserValidator,
  isAdminValidator,
  roleIdValidator,
  wrapRequestHandler(getRoleDetailController)
)

rolesRouter.post(
  '/:roleId/assign/user/:userId',
  accessTokenValidator,
  isVerifiedUserValidator,
  isAdminValidator,
  roleIdValidator,
  userIdValidator,
  userRoleNotExistValidator,
  wrapRequestHandler(assignRoleToUserController)
)

export default rolesRouter
