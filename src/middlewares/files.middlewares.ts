import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'

import { HttpStatusCode } from '~/constants/enum'
import { FILES_MESSAGES } from '~/constants/message'
import { ErrorWithStatus } from '~/models/Errors'
import databaseService from '~/services/database.services'
import { validate } from '~/utils/validation'

export const fileIdValidator = validate(
  checkSchema(
    {
      fileId: {
        trim: true,
        custom: {
          options: async (value: string) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: FILES_MESSAGES.FILE_ID_IS_REQUIRED,
                status: HttpStatusCode.BadRequest
              })
            }
            if (!ObjectId.isValid(value)) {
              throw new ErrorWithStatus({
                message: FILES_MESSAGES.INVALID_FILE_ID,
                status: HttpStatusCode.BadRequest
              })
            }
            const file = await databaseService.files.findOne({ _id: new ObjectId(value) })
            if (!file) {
              throw new ErrorWithStatus({
                message: FILES_MESSAGES.FILE_NOT_FOUND,
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
