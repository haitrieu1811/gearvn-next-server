import { Router } from 'express'

import { createRoleController } from '~/controllers/roles.controllers'
import { createRoleValidator, roleNotExistValidator } from '~/middlewares/roles.middlewares'
import { accessTokenValidator, isAdminValidator, isVerifiedUserValidator } from '~/middlewares/users.middlewares'
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

export default rolesRouter
