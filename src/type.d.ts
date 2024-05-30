import 'express'

import Product from '~/models/databases/Product.database'
import User from '~/models/databases/User.database'
import { TokenPayload } from '~/models/requests/User.requests'

declare module 'express' {
  interface Request {
    decodedAuthorization?: TokenPayload
    decodedRefreshToken?: TokenPayload
    decodedVerifyEmailToken?: TokenPayload
    decodedForgotPasswordToken?: TokenPayload
    user?: User
    product?: Product
  }
}
