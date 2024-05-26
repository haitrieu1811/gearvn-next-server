import { RoleField, RoleType } from '~/constants/enum'

export type CreateRoleReqBody = {
  type: RoleType
  field: RoleField
  name: string
  description?: string
}
