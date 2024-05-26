import { NextFunction, Request, Response } from 'express'
import { ParamSchema, checkSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import capitalize from 'lodash/capitalize'
import { ObjectId } from 'mongodb'

import { ENV_CONFIG } from '~/constants/config'
import { Gender, HttpStatusCode, UserStatus, UserType, UserVerifyStatus } from '~/constants/enum'
import { GENERAL_MESSAGES, USERS_MESSAGES } from '~/constants/message'
import { VIET_NAM_PHONE_NUMBER_REGEX } from '~/constants/regex'
import { ErrorWithStatus } from '~/models/Errors'
import { TokenPayload } from '~/models/requests/User.requests'
import databaseService from '~/services/database.services'
import { hashPassword } from '~/utils/crypto'
import { verifyToken } from '~/utils/jwt'
import { numberEnumToArray } from '~/utils/utils'
import { validate } from '~/utils/validation'

const genders = numberEnumToArray(Gender)
const userTypes = numberEnumToArray(UserType)
const userStatuses = numberEnumToArray(UserStatus)
const userVerifyStatuses = numberEnumToArray(UserVerifyStatus)

const emailSchema: ParamSchema = {
  trim: true,
  notEmpty: {
    errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED
  },
  isEmail: {
    errorMessage: USERS_MESSAGES.INVALID_EMAIL
  }
}

const passwordSchema: ParamSchema = {
  trim: true,
  notEmpty: {
    errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED
  },
  isLength: {
    options: {
      min: 12,
      max: 36
    },
    errorMessage: USERS_MESSAGES.INALID_PASSWORD_LENGHT
  },
  isStrongPassword: {
    options: {
      minLength: 1,
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 1,
      minNumbers: 1
    },
    errorMessage: USERS_MESSAGES.PASSWORD_IS_NOT_STRONG_ENOUGH
  }
}

const confirmPasswordSchema: ParamSchema = {
  trim: true,
  notEmpty: {
    errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED
  },
  custom: {
    options: (value: string, { req }) => {
      if (value !== req.body.password) {
        throw new Error(USERS_MESSAGES.CONFIRM_PASSWORD_DO_NOT_MATCH)
      }
      return true
    }
  }
}

const genderSchema: ParamSchema = {
  optional: true,
  custom: {
    options: (value) => {
      if (!genders.includes(value)) {
        throw new ErrorWithStatus({
          message: USERS_MESSAGES.INVALID_GENDER,
          status: HttpStatusCode.BadRequest
        })
      }
      return true
    }
  }
}

export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            const token = (value || '').split(' ')[1]
            if (!token) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
                status: HttpStatusCode.Unauthorized
              })
            }
            try {
              const decodedAuthorization = await verifyToken({
                token,
                secretOrPublicKey: ENV_CONFIG.JWT_ACCESS_TOKEN_SECRET
              })
              ;(req as Request).decodedAuthorization = decodedAuthorization
            } catch (error) {
              throw new ErrorWithStatus({
                message: capitalize((error as JsonWebTokenError).message),
                status: HttpStatusCode.Unauthorized
              })
            }
          }
        }
      }
    },
    ['headers']
  )
)

export const refreshTokenValidator = validate(
  checkSchema(
    {
      refreshToken: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.REFRESH_TOKEN_IS_REQUIRED,
                status: HttpStatusCode.Unauthorized
              })
            }
            try {
              const [decodedRefreshToken, refreshToken] = await Promise.all([
                verifyToken({ token: value, secretOrPublicKey: ENV_CONFIG.JWT_REFRESH_TOKEN_SECRET }),
                databaseService.refreshTokens.findOne({ token: value })
              ])
              if (!refreshToken) {
                throw new ErrorWithStatus({
                  message: USERS_MESSAGES.REFRESH_TOKEN_DOES_NOT_EXIST,
                  status: HttpStatusCode.Unauthorized
                })
              }
              ;(req as Request).decodedRefreshToken = decodedRefreshToken
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  message: capitalize(error.message),
                  status: HttpStatusCode.Unauthorized
                })
              }
              throw error
            }
          }
        }
      }
    },
    ['body']
  )
)

export const registerValidator = validate(
  checkSchema(
    {
      email: {
        ...emailSchema,
        custom: {
          options: async (value: string) => {
            const user = await databaseService.users.findOne({ email: value })
            if (user) {
              throw new Error(USERS_MESSAGES.EMAIL_ALREADY_EXISTS)
            }
            return true
          }
        }
      },
      fullName: {
        trim: true,
        notEmpty: {
          errorMessage: USERS_MESSAGES.FULLNAME_IS_REQUIRED
        }
      },
      password: passwordSchema,
      confirmPassword: confirmPasswordSchema
    },
    ['body']
  )
)

export const loginValidator = validate(
  checkSchema(
    {
      email: emailSchema,
      password: {
        trim: true,
        notEmpty: {
          errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED
        },
        custom: {
          options: async (value: string, { req }) => {
            const user = await databaseService.users.findOne({
              email: req.body.email,
              password: hashPassword(value)
            })
            if (!user) {
              throw new Error(USERS_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT)
            }
            if (user.status === UserStatus.Inactive) {
              throw new Error(USERS_MESSAGES.ACCOUNT_LOCKED)
            }
            ;(req as Request).user = user
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const verifyEmailValidator = validate(
  checkSchema(
    {
      verifyEmailToken: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.VERIFY_EMAIL_TOKEN_IS_REQUIRED,
                status: HttpStatusCode.Unauthorized
              })
            }
            const user = await databaseService.users.findOne({
              verifyEmailToken: value
            })
            if (!user) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.VERIFY_EMAIL_TOKEN_DOES_NOT_EXIST,
                status: HttpStatusCode.Unauthorized
              })
            }
            try {
              const decodedVerifyEmailToken = await verifyToken({
                token: value,
                secretOrPublicKey: ENV_CONFIG.JWT_VERIFY_EMAIL_TOKEN_SECRET
              })
              ;(req as Request).decodedVerifyEmailToken = decodedVerifyEmailToken
            } catch (error) {
              throw new ErrorWithStatus({
                message: capitalize((error as JsonWebTokenError).message),
                status: HttpStatusCode.Unauthorized
              })
            }
          }
        }
      }
    },
    ['body']
  )
)

export const forgotPasswordValidator = validate(
  checkSchema(
    {
      email: {
        ...emailSchema,
        custom: {
          options: async (value: string, { req }) => {
            const user = await databaseService.users.findOne({ email: value })
            if (!user) {
              throw new Error(USERS_MESSAGES.EMAIL_DOES_NOT_EXIST)
            }
            ;(req as Request).user = user
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const forgotPasswordTokenValidator = validate(
  checkSchema(
    {
      forgotPasswordToken: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.FORGOT_PASSWORD_TOKEN_IS_REQUIRED,
                status: HttpStatusCode.Unauthorized
              })
            }
            try {
              const [decodedForgotPasswordToken, user] = await Promise.all([
                verifyToken({ token: value, secretOrPublicKey: ENV_CONFIG.JWT_FORGOT_PASSWORD_TOKEN_SECRET }),
                databaseService.users.findOne({ forgotPasswordToken: value })
              ])
              if (!user) {
                throw new ErrorWithStatus({
                  message: USERS_MESSAGES.FORGOT_PASSWORD_TOKEN_DOES_NOT_EXIST,
                  status: HttpStatusCode.Unauthorized
                })
              }
              ;(req as Request).decodedForgotPasswordToken = decodedForgotPasswordToken
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  message: capitalize(error.message),
                  status: HttpStatusCode.Unauthorized
                })
              }
              throw error
            }
          }
        }
      }
    },
    ['body']
  )
)

export const resetPasswordValidator = validate(
  checkSchema(
    {
      password: passwordSchema,
      confirmPassword: confirmPasswordSchema
    },
    ['body']
  )
)

export const changePasswordValidator = validate(
  checkSchema(
    {
      password: passwordSchema,
      confirmPassword: confirmPasswordSchema
    },
    ['body']
  )
)

export const updateMeValidator = validate(
  checkSchema(
    {
      fullName: {
        optional: true,
        trim: true
      },
      gender: genderSchema,
      phoneNumber: {
        optional: true,
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            if (!VIET_NAM_PHONE_NUMBER_REGEX.test(value)) {
              throw new Error(USERS_MESSAGES.INVALID_PHONE_NUMBER)
            }
            const userByPhoneNumber = await databaseService.users.findOne({ phoneNumber: value })
            const { userId } = (req as Request).decodedAuthorization as TokenPayload
            if (userByPhoneNumber && userByPhoneNumber._id.toString() !== userId) {
              throw new Error(USERS_MESSAGES.PHONE_NUMBER_ALREADY_EXIST)
            }
            return true
          }
        }
      },
      avatar: {
        optional: true,
        trim: true,
        custom: {
          options: (value: string) => {
            if (!ObjectId.isValid(value)) {
              throw new ErrorWithStatus({
                message: GENERAL_MESSAGES.INVALID_IMAGE_ID,
                status: HttpStatusCode.BadRequest
              })
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const isAdminValidator = (req: Request, _: Response, next: NextFunction) => {
  const { userType } = req.decodedAuthorization as TokenPayload
  if (userType !== UserType.Admin) {
    next(
      new ErrorWithStatus({
        message: GENERAL_MESSAGES.PERMISSION_DENIED,
        status: HttpStatusCode.Forbidden
      })
    )
  }
  next()
}

export const getAllUsersValidator = validate(
  checkSchema(
    {
      type: {
        optional: true,
        custom: {
          options: (value) => {
            if (!userTypes.includes(value)) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.INVALID_USER_TYPE,
                status: HttpStatusCode.BadRequest
              })
            }
            return true
          }
        }
      },
      status: {
        optional: true,
        custom: {
          options: (value) => {
            if (!userStatuses.includes(value)) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.INVALID_USER_STATUS,
                status: HttpStatusCode.BadRequest
              })
            }
            return true
          }
        }
      },
      verify: {
        optional: true,
        custom: {
          options: (value) => {
            if (!userVerifyStatuses.includes(value)) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.INVALID_USER_VERIFY_STATUS,
                status: HttpStatusCode.BadRequest
              })
            }
            return true
          }
        }
      },
      gender: genderSchema
    },
    ['query']
  )
)
