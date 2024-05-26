import isUndefined from 'lodash/isUndefined'
import omitBy from 'lodash/omitBy'
import { ObjectId } from 'mongodb'

import Role from '~/models/databases/Role.database'
import { PaginationReqQuery } from '~/models/requests/Common.requests'
import { CreateRoleReqBody, UpdateRoleReqBody } from '~/models/requests/Role.requests'
import databaseService from '~/services/database.services'
import { paginationConfig } from '~/utils/utils'

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

  async findAll(query: PaginationReqQuery) {
    const { page, limit, skip } = paginationConfig(query)
    const [roles, totalRows] = await Promise.all([
      databaseService.roles
        .find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .project({
          userId: 0
        })
        .toArray(),
      databaseService.roles.countDocuments({})
    ])
    return {
      roles,
      page,
      limit,
      totalRows,
      totalPages: Math.ceil(totalRows / limit)
    }
  }
}

const roleService = new RoleService()
export default roleService
