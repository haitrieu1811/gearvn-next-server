import { Router } from 'express'

import {
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
  resendEmailVerifyController,
  verifyEmailController
} from '~/controllers/users.controllers'
import { filterReqBodyMiddleware } from '~/middlewares/common.middlewares'
import {
  accessTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  verifyEmailValidator
} from '~/middlewares/users.middlewares'
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

usersRouter.post('/resend-email-verify', accessTokenValidator, wrapRequestHandler(resendEmailVerifyController))

usersRouter.post('/verify-email', verifyEmailValidator, wrapRequestHandler(verifyEmailController))

export default usersRouter
