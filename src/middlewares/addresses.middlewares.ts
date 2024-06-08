import { NextFunction, Request, Response } from 'express'
import { ParamSchema, checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'

import { AddressType, HttpStatusCode } from '~/constants/enum'
import { ADDRESS_MESSAGES, GENERAL_MESSAGES } from '~/constants/message'
import { fullNameSchema, phoneNumberSchema } from '~/middlewares/users.middlewares'
import { ErrorWithStatus } from '~/models/Errors'
import { AddressIdReqParams } from '~/models/requests/Address.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import databaseService from '~/services/database.services'
import { numberEnumToArray } from '~/utils/utils'
import { validate } from '~/utils/validation'

const addressTypes = numberEnumToArray(AddressType)

export const provinceIdSchema: ParamSchema = {
  trim: true,
  custom: {
    options: async (value: string) => {
      if (!value) {
        throw new ErrorWithStatus({
          message: ADDRESS_MESSAGES.PROVINCE_ID_IS_REQUIRED,
          status: HttpStatusCode.BadRequest
        })
      }
      if (!ObjectId.isValid(value)) {
        throw new ErrorWithStatus({
          message: ADDRESS_MESSAGES.INVALID_PROVINCE_ID,
          status: HttpStatusCode.BadRequest
        })
      }
      const province = await databaseService.provinces.findOne({ _id: new ObjectId(value) })
      if (!province) {
        throw new ErrorWithStatus({
          message: ADDRESS_MESSAGES.PROVINCE_NOT_FOUND,
          status: HttpStatusCode.NotFound
        })
      }
      return true
    }
  }
}

export const districtIdSchema: ParamSchema = {
  trim: true,
  custom: {
    options: async (value: string, { req }) => {
      if (!value) {
        throw new ErrorWithStatus({
          message: ADDRESS_MESSAGES.DISTRICT_ID_IS_REQUIRED,
          status: HttpStatusCode.BadRequest
        })
      }
      const province = await databaseService.provinces.findOne({ _id: new ObjectId(String(req.body.provinceId)) })
      const districtIds = province?.districts.map((district) => district.id) || []
      if (!districtIds.includes(value)) {
        throw new ErrorWithStatus({
          message: ADDRESS_MESSAGES.DISTRICT_NOT_FOUND,
          status: HttpStatusCode.NotFound
        })
      }
      return true
    }
  }
}

export const wardIdSchema: ParamSchema = {
  trim: true,
  custom: {
    options: async (value: string, { req }) => {
      if (!value) {
        throw new ErrorWithStatus({
          message: ADDRESS_MESSAGES.WARD_ID_IS_REQUIRED,
          status: HttpStatusCode.BadRequest
        })
      }
      const province = await databaseService.provinces.findOne({ _id: new ObjectId(String(req.body.provinceId)) })
      const district = province?.districts.find((district) => district.id === String(req.body.districtId))
      const wardIds = district?.wards.map((ward) => ward.id) || []
      if (!wardIds.includes(value)) {
        throw new ErrorWithStatus({
          message: ADDRESS_MESSAGES.WARD_NOT_FOUND,
          status: HttpStatusCode.NotFound
        })
      }
      return true
    }
  }
}

export const streetIdSchema: ParamSchema = {
  trim: true,
  custom: {
    options: async (value: string, { req }) => {
      if (!value) {
        throw new ErrorWithStatus({
          message: ADDRESS_MESSAGES.STREET_ID_IS_REQUIRED,
          status: HttpStatusCode.BadRequest
        })
      }
      const province = await databaseService.provinces.findOne({ _id: new ObjectId(String(req.body.provinceId)) })
      const district = province?.districts.find((district) => district.id === String(req.body.districtId))
      const streets = district?.streets.map((street) => street.id) || []
      if (!streets.includes(value)) {
        throw new ErrorWithStatus({
          message: ADDRESS_MESSAGES.STREET_NOT_FOUND,
          status: HttpStatusCode.NotFound
        })
      }
      return true
    }
  }
}

export const detailAddressSchema: ParamSchema = {
  trim: true,
  notEmpty: {
    errorMessage: ADDRESS_MESSAGES.ADDRESS_DETAIL_IS_REQUIRED
  }
}

export const createAddressValidator = validate(
  checkSchema(
    {
      provinceId: provinceIdSchema,
      districtId: districtIdSchema,
      wardId: wardIdSchema,
      streetId: streetIdSchema,
      detailAddress: detailAddressSchema,
      type: {
        notEmpty: {
          errorMessage: ADDRESS_MESSAGES.ADDRESS_TYPE_IS_REQUIRED
        },
        isIn: {
          options: [addressTypes],
          errorMessage: ADDRESS_MESSAGES.INVALID_ADDRESS_TYPE
        }
      },
      fullName: fullNameSchema,
      phoneNumber: phoneNumberSchema
    },
    ['body']
  )
)

export const addressIdValidator = validate(
  checkSchema(
    {
      addressId: {
        trim: true,
        custom: {
          options: async (value: string) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: ADDRESS_MESSAGES.ADDRESS_ID_IS_REQUIRED,
                status: HttpStatusCode.BadRequest
              })
            }
            if (!ObjectId.isValid(value)) {
              throw new ErrorWithStatus({
                message: ADDRESS_MESSAGES.INVALID_ADDRESS_ID,
                status: HttpStatusCode.BadRequest
              })
            }
            const address = await databaseService.addresses.findOne({ _id: new ObjectId(value) })
            if (!address) {
              throw new ErrorWithStatus({
                message: ADDRESS_MESSAGES.ADDRESS_NOT_FOUND,
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

export const addressAuthorValidator = async (req: Request<AddressIdReqParams>, _: Response, next: NextFunction) => {
  const { userId } = req.decodedAuthorization as TokenPayload
  const address = await databaseService.addresses.findOne({ _id: new ObjectId(req.params.addressId) })
  if (address?.userId.toString() !== userId) {
    next(
      new ErrorWithStatus({
        message: GENERAL_MESSAGES.PERMISSION_DENIED,
        status: HttpStatusCode.Forbidden
      })
    )
  }
  next()
}
