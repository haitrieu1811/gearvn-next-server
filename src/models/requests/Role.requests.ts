import { ParamsDictionary } from 'express-serve-static-core'

import { RoleField, RoleType } from '~/constants/enum'
import { UserIdReqParams } from '~/models/requests/User.requests'

export type CreateRoleReqBody = {
  type: RoleType
  field: RoleField
  name: string
  description?: string
}

export type UpdateRoleReqBody = {
  type?: RoleType
  field?: RoleField
  name?: string
  description?: string
}

export type RoleIdReqParams = ParamsDictionary & {
  roleId: string
}

export type AssignRoleToUserReqParams = RoleIdReqParams & UserIdReqParams
