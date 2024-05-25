import { checkSchema } from 'express-validator'

import { USERS_MESSAGES } from '~/constants/message'
import databaseService from '~/services/database.services'
import { validate } from '~/utils/validation'

export const registerValidator = validate(
  checkSchema(
    {
      email: {
        trim: true,
        notEmpty: {
          errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED
        },
        isEmail: {
          errorMessage: USERS_MESSAGES.INVALID_EMAIL
        },
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
      password: {
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
      },
      confirmPassword: {
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
    },
    ['body']
  )
)
