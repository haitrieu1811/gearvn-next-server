import { Router } from 'express'

import { registerController } from '~/controllers/users.controllers'
import { filterReqBodyMiddleware } from '~/middlewares/common.middlewares'
import { registerValidator } from '~/middlewares/users.middlewares'
import { RegisterReqBody } from '~/models/requests/User.requests'
import { wrapRequestHandler } from '~/utils/handler'

const usersRouter = Router()

usersRouter.post(
  '/register',
  registerValidator,
  filterReqBodyMiddleware<RegisterReqBody>(['email', 'fullName', 'password']),
  wrapRequestHandler(registerController)
)

export default usersRouter
