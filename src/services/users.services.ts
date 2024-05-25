import { ObjectId, WithId } from 'mongodb'
import omit from 'lodash/omit'

import { ENV_CONFIG } from '~/constants/config'
import { TokenType, UserStatus, UserType, UserVerifyStatus } from '~/constants/enum'
import RefreshToken from '~/models/databases/RefreshToken.database'
import User from '~/models/databases/User.database'
import { RegisterReqBody } from '~/models/requests/User.requests'
import databaseService from '~/services/database.services'
import { hashPassword } from '~/utils/crypto'
import { sendVerifyEmail } from '~/utils/email'
import { signToken, verifyToken } from '~/utils/jwt'

type SignToken = {
  userId: string
  verify: UserVerifyStatus
  status: UserStatus
  type: UserType
  iat?: number
  exp?: number
}

class UserService {
  private signAccessToken({ userId, verify, status, type }: SignToken) {
    return signToken({
      payload: {
        userId,
        tokenType: TokenType.AccessToken,
        userVerifyStatus: verify,
        userStatus: status,
        userType: type
      },
      privateKey: ENV_CONFIG.JWT_ACCESS_TOKEN_SECRET,
      options: {
        expiresIn: ENV_CONFIG.JWT_ACCESS_TOKEN_EXPIRED_IN
      }
    })
  }

  private signRefreshToken({ userId, verify, status, type, exp }: SignToken) {
    if (exp) {
      return signToken({
        payload: {
          userId,
          tokenType: TokenType.RefreshToken,
          userVerifyStatus: verify,
          userStatus: status,
          userType: type,
          exp
        },
        privateKey: ENV_CONFIG.JWT_REFRESH_TOKEN_SECRET
      })
    }
    return signToken({
      payload: {
        userId,
        tokenType: TokenType.RefreshToken,
        userStatus: status,
        userVerifyStatus: verify,
        userType: type
      },
      privateKey: ENV_CONFIG.JWT_REFRESH_TOKEN_SECRET,
      options: {
        expiresIn: ENV_CONFIG.JWT_REFRESH_TOKEN_EXPIRED_IN
      }
    })
  }

  private signVerifyEmailToken(userId: string) {
    return signToken({
      payload: {
        userId,
        tokenType: TokenType.VerifyEmailToken
      },
      privateKey: ENV_CONFIG.JWT_VERIFY_EMAIL_TOKEN_SECRET,
      options: {
        expiresIn: ENV_CONFIG.JWT_VERIFY_EMAIL_TOKEN_EXPIRED_IN
      }
    })
  }

  private signForgotPasswordToken(userId: string) {
    return signToken({
      payload: {
        userId,
        tokenType: TokenType.ForgotPasswordToken
      },
      privateKey: ENV_CONFIG.JWT_FORGOT_PASSWORD_TOKEN_SECRET,
      options: {
        expiresIn: ENV_CONFIG.JWT_FORGOT_PASSWORD_TOKEN_EXPIRED_IN
      }
    })
  }

  private signAccessAndRefreshToken({ userId, verify, type, status, exp }: SignToken) {
    return Promise.all([
      this.signAccessToken({ userId, verify, type, status }),
      this.signRefreshToken({ userId, verify, type, status, exp })
    ])
  }

  private decodeRefreshToken(refreshToken: string) {
    return verifyToken({
      token: refreshToken,
      secretOrPublicKey: ENV_CONFIG.JWT_REFRESH_TOKEN_SECRET
    })
  }

  async register(data: RegisterReqBody) {
    const userId = new ObjectId()
    const verifyEmailToken = await this.signVerifyEmailToken(userId.toString())
    const newUser = new User({
      ...data,
      _id: userId,
      password: hashPassword(data.password),
      verifyEmailToken
    })
    const { type, status, verify } = newUser
    const [[accessToken, refreshToken]] = await Promise.all([
      this.signAccessAndRefreshToken({ type, status, verify, userId: userId.toString() }),
      databaseService.users.insertOne(newUser),
      sendVerifyEmail(data.email, verifyEmailToken)
    ])
    const { iat, exp } = await this.decodeRefreshToken(refreshToken)
    const [insertedUser] = await Promise.all([
      databaseService.users.findOne(
        {
          _id: userId
        },
        {
          projection: {
            password: 0,
            avatar: 0,
            type: 0,
            gender: 0,
            phoneNumber: 0,
            addresses: 0,
            defaultAddress: 0,
            status: 0,
            verify: 0,
            verifyEmailToken: 0,
            forgotPasswordToken: 0
          }
        }
      ),
      databaseService.refreshTokens.insertOne(
        new RefreshToken({
          token: refreshToken,
          iat,
          exp
        })
      )
    ])
    return {
      accessToken,
      refreshToken,
      user: insertedUser
    }
  }

  async login(user: WithId<User>) {
    const { _id, type, status, verify } = user
    const [accessToken, refreshToken] = await this.signAccessAndRefreshToken({
      userId: _id.toString(),
      type,
      status,
      verify
    })
    const { iat, exp } = await this.decodeRefreshToken(refreshToken)
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        token: refreshToken,
        iat,
        exp
      })
    )
    const userConfig = omit(user, [
      'password',
      'avatar',
      'type',
      'gender',
      'phoneNumber',
      'addresses',
      'defaultAddress',
      'status',
      'verify',
      'verifyEmailToken',
      'forgotPasswordToken'
    ])
    return {
      accessToken,
      refreshToken,
      user: userConfig
    }
  }

  async logout(refreshToken: string) {
    return databaseService.refreshTokens.deleteOne({ token: refreshToken })
  }
}

const userService = new UserService()
export default userService
