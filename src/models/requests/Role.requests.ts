import { ParamsDictionary } from 'express-serve-static-core'

import { RoleField, RoleType } from '~/constants/enum'

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
