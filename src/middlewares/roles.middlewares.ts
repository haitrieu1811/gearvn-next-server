import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ParamSchema, checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'

import { HttpStatusCode, RoleField, RoleType } from '~/constants/enum'
import { ROLES_MESSAGES } from '~/constants/message'
import { ErrorWithStatus } from '~/models/Errors'
import { CreateRoleReqBody } from '~/models/requests/Role.requests'
import databaseService from '~/services/database.services'
import { numberEnumToArray } from '~/utils/utils'
import { validate } from '~/utils/validation'

const roleTypes = numberEnumToArray(RoleType)
const roleFields = numberEnumToArray(RoleField)

const roleTypeSchema: ParamSchema = {
  notEmpty: {
    errorMessage: ROLES_MESSAGES.ROLE_TYPE_IS_REQUIRED
  },
  isIn: {
    options: [roleTypes],
    errorMessage: ROLES_MESSAGES.INVALID_ROLE_TYPE
  }
}

const roleFieldSchema: ParamSchema = {
  notEmpty: {
    errorMessage: ROLES_MESSAGES.ROLE_FIELD_IS_REQUIRED
  },
  isIn: {
    options: [roleFields],
    errorMessage: ROLES_MESSAGES.INVALID_ROLE_FIELD
  }
}

export const createRoleValidator = validate(
  checkSchema(
    {
      type: roleTypeSchema,
      field: roleFieldSchema,
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

export const roleIdValidator = validate(
  checkSchema(
    {
      roleId: {
        trim: true,
        custom: {
          options: async (value: string) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: ROLES_MESSAGES.ROLE_ID_IS_REQUIRED,
                status: HttpStatusCode.BadRequest
              })
            }
            if (!ObjectId.isValid(value)) {
              throw new ErrorWithStatus({
                message: ROLES_MESSAGES.INVALID_ROLE_ID,
                status: HttpStatusCode.BadRequest
              })
            }
            const role = await databaseService.roles.findOne({ _id: new ObjectId(value) })
            if (!role) {
              throw new ErrorWithStatus({
                message: ROLES_MESSAGES.ROLE_NOT_FOUND,
                status: HttpStatusCode.NotFound
              })
            }
            return true
          }
        }
      }
    },
    ['params']
  )
)

export const updateRoleValidator = validate(
  checkSchema(
    {
      type: {
        ...roleTypeSchema,
        optional: true,
        notEmpty: undefined
      },
      field: {
        ...roleFieldSchema,
        optional: true,
        notEmpty: undefined
      },
      name: {
        optional: true,
        trim: true
      },
      description: {
        trim: true,
        optional: true
      }
    },
    ['body']
  )
)
