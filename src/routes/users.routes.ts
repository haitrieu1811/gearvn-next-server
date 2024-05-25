import { Router } from 'express'

import {
  loginController,
  logoutController,
  refreshTokenController,
  registerController
} from '~/controllers/users.controllers'
import { filterReqBodyMiddleware } from '~/middlewares/common.middlewares'
import { loginValidator, refreshTokenValidator, registerValidator } from '~/middlewares/users.middlewares'
import { RegisterReqBody } from '~/models/requests/User.requests'
import { wrapRequestHandler } from '~/utils/handler'

const usersRouter = Router()

usersRouter.post(
  '/register',
  registerValidator,
  filterReqBodyMiddleware<RegisterReqBody>(['email', 'fullName', 'password']),
  wrapRequestHandler(registerController)
)

usersRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

usersRouter.post('/logout', refreshTokenValidator, wrapRequestHandler(logoutController))

usersRouter.post('/refresh-token', refreshTokenValidator, wrapRequestHandler(refreshTokenController))

export default usersRouter
