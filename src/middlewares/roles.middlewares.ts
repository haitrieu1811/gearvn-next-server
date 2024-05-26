import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { checkSchema } from 'express-validator'

import { HttpStatusCode, RoleField, RoleType } from '~/constants/enum'
import { ROLES_MESSAGES } from '~/constants/message'
import { ErrorWithStatus } from '~/models/Errors'
import { CreateRoleReqBody } from '~/models/requests/Role.requests'
import databaseService from '~/services/database.services'
import { numberEnumToArray } from '~/utils/utils'
import { validate } from '~/utils/validation'

const roleTypes = numberEnumToArray(RoleType)
const roleFields = numberEnumToArray(RoleField)

export const createRoleValidator = validate(
  checkSchema(
    {
      type: {
        custom: {
          options: (value) => {
            if (value === undefined) {
              throw new ErrorWithStatus({
                message: ROLES_MESSAGES.ROLE_TYPE_IS_REQUIRED,
                status: HttpStatusCode.BadRequest
              })
            }
            if (!roleTypes.includes(value)) {
              throw new ErrorWithStatus({
                message: ROLES_MESSAGES.INVALID_ROLE_TYPE,
                status: HttpStatusCode.BadRequest
              })
            }
            return true
          }
        }
      },
      field: {
        custom: {
          options: (value) => {
            if (value === undefined) {
              throw new ErrorWithStatus({
                message: ROLES_MESSAGES.ROLE_FIELD_IS_REQUIRED,
                status: HttpStatusCode.BadRequest
              })
            }
            if (!roleFields.includes(value)) {
              throw new ErrorWithStatus({
                message: ROLES_MESSAGES.INVALID_ROLE_FIELD,
                status: HttpStatusCode.BadRequest
              })
            }
            return true
          }
        }
      },
      name: {
        trim: true,
        notEmpty: {
          errorMessage: ROLES_MESSAGES.ROLE_NAME_IS_REQUIRED
        }
      },
      description: {
        trim: true,
        optional: true
      }
    },
    ['body']
  )
)

export const roleNotExistValidator = async (
  req: Request<ParamsDictionary, any, CreateRoleReqBody>,
  _: Response,
  next: NextFunction
) => {
  const { type, field } = req.body
  const role = await databaseService.roles.findOne({
    type,
    field
  })
  if (role) {
    next(
      new ErrorWithStatus({
        message: ROLES_MESSAGES.ROLE_ALREADY_EXIST,
        status: HttpStatusCode.BadRequest
      })
    )
  }
  next()
}
