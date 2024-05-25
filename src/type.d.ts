import 'express'

import User from '~/models/databases/User.database'
import { TokenPayload } from '~/models/requests/User.requests'

declare module 'express' {
  interface Request {
    decodedAuthorization?: TokenPayload
    decodedRefreshToken?: TokenPayload
    decodedVerifyEmailToken?: TokenPayload
    decodedForgotPasswordToken?: TokenPayload
    user?: User
  }
}
