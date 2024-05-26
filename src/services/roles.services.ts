import isUndefined from 'lodash/isUndefined'
import omitBy from 'lodash/omitBy'
import { ObjectId } from 'mongodb'

import Role from '~/models/databases/Role.database'
import { CreateRoleReqBody, UpdateRoleReqBody } from '~/models/requests/Role.requests'
import databaseService from '~/services/database.services'

class RoleService {
  async create({ data, userId }: { data: CreateRoleReqBody; userId: ObjectId }) {
    const { insertedId } = await databaseService.roles.insertOne(
      new Role({
        ...data,
        userId
      })
    )
    const insertedRole = await databaseService.roles.findOne({ _id: insertedId })
    return {
      role: insertedRole
    }
  }

  async update({ data, roleId }: { data: UpdateRoleReqBody; roleId: ObjectId }) {
    const configuredData = omitBy(data, isUndefined)
    const updatedRole = await databaseService.roles.findOneAndUpdate(
      {
        _id: roleId
      },
      {
        $set: configuredData,
        $currentDate: {
          updatedAt: true
        }
      },
      {
        returnDocument: 'after'
      }
    )
    return {
      role: updatedRole
    }
  }
}

const roleService = new RoleService()
export default roleService
