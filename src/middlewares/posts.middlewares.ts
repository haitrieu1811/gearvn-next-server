import { ParamSchema, checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'

import { HttpStatusCode, PostApprovalStatus, PostStatus, RoleField, RoleType } from '~/constants/enum'
import { POSTS_MESSAGES } from '~/constants/message'
import { generateRoleValidator } from '~/middlewares/roles.middlewares'
import { ErrorWithStatus } from '~/models/Errors'
import { numberEnumToArray } from '~/utils/utils'
import { validate } from '~/utils/validation'

const statuses = numberEnumToArray(PostStatus)
const approvalStatues = numberEnumToArray(PostApprovalStatus)

const titleSchema: ParamSchema = {
  trim: true,
  notEmpty: {
    errorMessage: POSTS_MESSAGES.POST_TITLE_IS_REQUIRED
  }
}

const contentSchema: ParamSchema = {
  trim: true,
  notEmpty: {
    errorMessage: POSTS_MESSAGES.POST_CONTENT_IS_REQUIRED
  }
}

const descriptionSchema: ParamSchema = {
  trim: true,
  notEmpty: {
    errorMessage: POSTS_MESSAGES.POST_DESCRIPTION_IS_REQUIRED
  }
}

const thumbnailSchema: ParamSchema = {
  trim: true,
  custom: {
    options: (value: string) => {
      if (!value) {
        throw new ErrorWithStatus({
          message: POSTS_MESSAGES.POST_THUMBNAIL_IS_REQUIRED,
          status: HttpStatusCode.BadRequest
        })
      }
      if (!ObjectId.isValid(value)) {
        throw new ErrorWithStatus({
          message: POSTS_MESSAGES.INVALID_POST_THUMBNAIL,
          status: HttpStatusCode.BadRequest
        })
      }
      return true
    }
  }
}

const orderNumberSchema: ParamSchema = {
  optional: true,
  custom: {
    options: (value) => {
      if (!Number.isInteger(value) || value < 0) {
        throw new ErrorWithStatus({
          message: POSTS_MESSAGES.POST_ORDER_NUMBER_MUST_BE_AN_POSITIVE_INTEGER,
          status: HttpStatusCode.BadRequest
        })
      }
      return true
    }
  }
}

const statusSchema: ParamSchema = {
  optional: true,
  custom: {
    options: (value) => {
      if (!statuses.includes(value)) {
        throw new ErrorWithStatus({
          message: POSTS_MESSAGES.INVALID_POST_STATUS,
          status: HttpStatusCode.BadRequest
        })
      }
    }
  }
}

const approvalStatusSchema: ParamSchema = {
  optional: true,
  custom: {
    options: (value) => {
      if (!approvalStatues.includes(value)) {
        throw new ErrorWithStatus({
          message: POSTS_MESSAGES.INVALID_POST_APPROVAL_STATUS,
          status: HttpStatusCode.BadRequest
        })
      }
    }
  }
}

export const createPostValidator = validate(
  checkSchema(
    {
      title: titleSchema,
      content: contentSchema,
      description: descriptionSchema,
      thumbnail: thumbnailSchema,
      orderNumber: orderNumberSchema,
      status: statusSchema,
      approvalStatus: approvalStatusSchema
    },
    ['body']
  )
)

export const createPostRoleValidator = generateRoleValidator({ roleType: RoleType.Create, roleField: RoleField.Post })
