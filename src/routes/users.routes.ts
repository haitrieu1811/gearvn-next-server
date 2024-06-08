import { Router } from 'express'

import {
  changePasswordController,
  createUserController,
  forgotPasswordController,
  getAllUsersController,
  getMeController,
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
  resendEmailVerifyController,
  resetPasswordController,
  updateMeController,
  verifyEmailController
} from '~/controllers/users.controllers'
import { filterReqBodyMiddleware, paginationValidator } from '~/middlewares/common.middlewares'
import {
  accessTokenValidator,
  changePasswordValidator,
  createUserValidator,
  forgotPasswordTokenValidator,
  forgotPasswordValidator,
  getAllUsersValidator,
  isAdminValidator,
  isVerifiedUserValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  updateMeValidator,
  verifyEmailValidator
} from '~/middlewares/users.middlewares'
import { CreateUserReqBody, RegisterReqBody, UpdateMeReqBody } from '~/models/requests/User.requests'
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

usersRouter.post('/forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordController))

usersRouter.post(
  '/reset-password',
  forgotPasswordTokenValidator,
  resetPasswordValidator,
  wrapRequestHandler(resetPasswordController)
)

usersRouter.post(
  '/change-password',
  accessTokenValidator,
  changePasswordValidator,
  wrapRequestHandler(changePasswordController)
)

usersRouter.patch(
  '/me',
  accessTokenValidator,
  updateMeValidator,
  filterReqBodyMiddleware<UpdateMeReqBody>(['avatar', 'fullName', 'gender', 'phoneNumber']),
  wrapRequestHandler(updateMeController)
)

usersRouter.get('/me', accessTokenValidator, wrapRequestHandler(getMeController))

usersRouter.get(
  '/all',
  accessTokenValidator,
  isAdminValidator,
  paginationValidator,
  getAllUsersValidator,
  wrapRequestHandler(getAllUsersController)
)

usersRouter.post(
  '/',
  accessTokenValidator,
  isVerifiedUserValidator,
  isAdminValidator,
  createUserValidator,
  filterReqBodyMiddleware<CreateUserReqBody>(['confirmPassword', 'email', 'fullName', 'gender', 'password', 'type']),
  wrapRequestHandler(createUserController)
)

export default usersRouter
