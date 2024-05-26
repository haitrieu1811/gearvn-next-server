import { ObjectId } from 'mongodb'

import Role from '~/models/databases/Role.database'
import { CreateRoleReqBody } from '~/models/requests/Role.requests'
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
}

const roleService = new RoleService()
export default roleService
