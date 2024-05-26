import isUndefined from 'lodash/isUndefined'
import omitBy from 'lodash/omitBy'
import pick from 'lodash/pick'
import { ObjectId, WithId } from 'mongodb'

import { ENV_CONFIG } from '~/constants/config'
import { TokenType, UserStatus, UserType, UserVerifyStatus } from '~/constants/enum'
import RefreshToken from '~/models/databases/RefreshToken.database'
import User from '~/models/databases/User.database'
import { RegisterReqBody, UpdateMeReqBody } from '~/models/requests/User.requests'
import databaseService from '~/services/database.services'
import fileService from '~/services/files.services'
import { hashPassword } from '~/utils/crypto'
import { sendForgotPasswordEmail, sendVerifyEmail } from '~/utils/email'
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
            _id: 1,
            fullName: 1,
            email: 1,
            createdAt: 1,
            updatedAt: 1
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
    const userConfig = pick(user, ['_id', 'email', 'fullName', 'createdAt', 'updatedAt'])
    return {
      accessToken,
      refreshToken,
      user: userConfig
    }
  }

  async logout(refreshToken: string) {
    return databaseService.refreshTokens.deleteOne({ token: refreshToken })
  }

  async refreshToken({
    refreshToken,
    userId,
    userVerifyStatus,
    userStatus,
    userType,
    refreshTokenExp
  }: {
    refreshToken: string
    userId: string
    userVerifyStatus: UserVerifyStatus
    userStatus: UserStatus
    userType: UserType
    refreshTokenExp: number
  }) {
    const [[newAccessToken, newRefreshToken]] = await Promise.all([
      this.signAccessAndRefreshToken({
        userId,
        verify: userVerifyStatus,
        status: userStatus,
        type: userType,
        exp: refreshTokenExp
      }),
      databaseService.refreshTokens.deleteOne({ token: refreshToken })
    ])
    const { iat, exp } = await this.decodeRefreshToken(newRefreshToken)
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        iat,
        exp,
        token: newRefreshToken
      })
    )
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    }
  }

  async resendEmailVerify(userId: ObjectId) {
    const [verifyEmailToken, user] = await Promise.all([
      this.signVerifyEmailToken(userId.toString()),
      databaseService.users.findOne({ _id: userId })
    ])
    await Promise.all([
      sendVerifyEmail((user as WithId<User>).email, verifyEmailToken),
      databaseService.users.updateOne(
        {
          _id: userId
        },
        {
          $set: {
            verifyEmailToken
          },
          $currentDate: {
            updatedAt: true
          }
        }
      )
    ])
    return true
  }

  async verifyEmail(userId: ObjectId) {
    const updatedUser = await databaseService.users.findOneAndUpdate(
      {
        _id: userId
      },
      {
        $set: {
          verifyEmailToken: '',
          verify: UserVerifyStatus.Verified
        },
        $currentDate: {
          updatedAt: true
        }
      },
      {
        returnDocument: 'after',
        projection: {
          _id: 1,
          email: 1,
          fullName: 1,
          createdAt: 1,
          updatedAt: 1
        }
      }
    )
    const { _id, type, status, verify } = updatedUser as WithId<User>
    const [accessToken, refreshToken] = await this.signAccessAndRefreshToken({
      userId: _id.toString(),
      type,
      status,
      verify
    })
    return {
      accessToken,
      refreshToken,
      user: updatedUser
    }
  }

  async forgotPassword({ userId, email }: { userId: ObjectId; email: string }) {
    const forgotPasswordToken = await this.signForgotPasswordToken(userId.toString())
    await Promise.all([
      sendForgotPasswordEmail(email, forgotPasswordToken),
      databaseService.users.updateOne(
        {
          _id: new ObjectId(userId)
        },
        {
          $set: {
            forgotPasswordToken
          },
          $currentDate: {
            updatedAt: true
          }
        }
      )
    ])
    return true
  }

  async resetPassword({ password, userId }: { password: string; userId: ObjectId }) {
    const updatedUser = await databaseService.users.findOneAndUpdate(
      {
        _id: userId
      },
      {
        $set: {
          password: hashPassword(password),
          forgotPasswordToken: ''
        },
        $currentDate: {
          updatedAt: true
        }
      },
      {
        returnDocument: 'after',
        projection: {
          _id: 1,
          fullName: 1,
          email: 1,
          createdAt: 1,
          updatedAt: 1
        }
      }
    )
    const { _id, type, status, verify } = updatedUser as WithId<User>
    const [accessToken, refreshToken] = await this.signAccessAndRefreshToken({
      userId: _id.toString(),
      type,
      status,
      verify
    })
    return {
      accessToken,
      refreshToken,
      user: updatedUser
    }
  }

  async changePassword({ password, userId }: { password: string; userId: ObjectId }) {
    const updatedUser = await databaseService.users.findOneAndUpdate(
      {
        _id: userId
      },
      {
        $set: {
          password: hashPassword(password)
        },
        $currentDate: {
          updatedAt: true
        }
      },
      {
        returnDocument: 'after',
        projection: {
          _id: 1,
          fullName: 1,
          email: 1,
          createdAt: 1,
          updatedAt: 1
        }
      }
    )
    return {
      user: updatedUser
    }
  }

  async updateMe({ data, userId }: { data: UpdateMeReqBody; userId: ObjectId }) {
    const configuredData = omitBy(
      {
        ...data,
        avatar: data.avatar ? new ObjectId(data.avatar) : undefined
      },
      isUndefined
    )
    const updatedUser = await databaseService.users.findOneAndUpdate(
      {
        _id: userId
      },
      {
        $set: configuredData,
        $currentDate: {
          updatedAt: true
        }
      },
      {
        projection: {
          avatar: 1
        }
      }
    )
    if (updatedUser && updatedUser.avatar && configuredData.avatar) {
      await fileService.deleteImage(updatedUser.avatar)
    }
    const user = await databaseService.users.findOne(
      {
        _id: userId
      },
      {
        projection: {
          _id: 1,
          email: 1,
          fullName: 1,
          createdAt: 1,
          updatedAt: 1
        }
      }
    )
    return {
      user
    }
  }
}

const userService = new UserService()
export default userService
