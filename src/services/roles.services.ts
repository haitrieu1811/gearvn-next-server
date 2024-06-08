import isUndefined from 'lodash/isUndefined'
import omitBy from 'lodash/omitBy'
import { ObjectId } from 'mongodb'

import { ENV_CONFIG } from '~/constants/config'
import Role from '~/models/databases/Role.database'
import UserRole from '~/models/databases/UserRole.database'
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
        .sort({ name: -1 })
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

  async findById(roleId: ObjectId) {
    const role = await databaseService.roles.findOne(
      {
        _id: roleId
      },
      {
        projection: {
          userId: 0
        }
      }
    )
    return {
      role
    }
  }

  async assignRoleToUser({ roleId, userId }: { roleId: ObjectId; userId: ObjectId }) {
    await databaseService.userRoles.insertOne(
      new UserRole({
        roleId,
        userId
      })
    )
    return true
  }

  async unassignRoleOfUser({ roleId, userId }: { roleId: ObjectId; userId: ObjectId }) {
    await databaseService.userRoles.deleteOne({
      roleId,
      userId
    })
    return true
  }

  async getPermissionsGroupByUser(query: PaginationReqQuery) {
    const { page, limit, skip } = paginationConfig(query)
    const [permissions, totalRows] = await Promise.all([
      databaseService.userRoles
        .aggregate([
          {
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: '_id',
              as: 'user'
            }
          },
          {
            $unwind: {
              path: '$user'
            }
          },
          {
            $lookup: {
              from: 'files',
              localField: 'user.avatar',
              foreignField: '_id',
              as: 'userAvatar'
            }
          },
          {
            $unwind: {
              path: '$userAvatar',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $lookup: {
              from: 'roles',
              localField: 'roleId',
              foreignField: '_id',
              as: 'role'
            }
          },
          {
            $unwind: {
              path: '$role'
            }
          },
          {
            $addFields: {
              'user.avatar': {
                $cond: {
                  if: '$userAvatar',
                  then: {
                    $concat: [ENV_CONFIG.HOST, '/', ENV_CONFIG.STATIC_IMAGES_PATH, '/', '$userAvatar.name']
                  },
                  else: ''
                }
              }
            }
          },
          {
            $group: {
              _id: '$user._id',
              user: {
                $first: '$user'
              },
              roles: {
                $push: '$role'
              },
              createdAt: {
                $first: '$createdAt'
              },
              updatedAt: {
                $first: '$updatedAt'
              }
            }
          },
          {
            $addFields: {
              'user.roles': '$roles'
            }
          },
          {
            $replaceRoot: {
              newRoot: '$user'
            }
          },
          {
            $project: {
              password: 0,
              addresses: 0,
              defaultAddress: 0,
              verifyEmailToken: 0,
              forgotPasswordToken: 0,
              createdAt: 0,
              updatedAt: 0,
              'roles.userId': 0,
              'roles.type': 0,
              'roles.field': 0
            }
          },
          {
            $skip: skip
          },
          {
            $limit: limit
          }
        ])
        .toArray(),
      databaseService.userRoles
        .aggregate([
          {
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: '_id',
              as: 'user'
            }
          },
          {
            $unwind: {
              path: '$user'
            }
          },
          {
            $lookup: {
              from: 'files',
              localField: 'user.avatar',
              foreignField: '_id',
              as: 'userAvatar'
            }
          },
          {
            $unwind: {
              path: '$userAvatar',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $lookup: {
              from: 'roles',
              localField: 'roleId',
              foreignField: '_id',
              as: 'role'
            }
          },
          {
            $unwind: {
              path: '$role'
            }
          },
          {
            $addFields: {
              'user.avatar': {
                $cond: {
                  if: '$userAvatar',
                  then: {
                    $concat: [ENV_CONFIG.HOST, '/', ENV_CONFIG.STATIC_IMAGES_PATH, '/', '$userAvatar.name']
                  },
                  else: ''
                }
              }
            }
          },
          {
            $group: {
              _id: '$user._id',
              user: {
                $first: '$user'
              },
              roles: {
                $push: '$role'
              },
              createdAt: {
                $first: '$createdAt'
              },
              updatedAt: {
                $first: '$updatedAt'
              }
            }
          },
          {
            $addFields: {
              'user.roles': '$roles'
            }
          },
          {
            $replaceRoot: {
              newRoot: '$user'
            }
          },
          {
            $project: {
              password: 0,
              addresses: 0,
              defaultAddress: 0,
              verifyEmailToken: 0,
              forgotPasswordToken: 0,
              createdAt: 0,
              updatedAt: 0,
              'roles.userId': 0,
              'roles.type': 0,
              'roles.field': 0
            }
          },
          {
            $count: 'total'
          }
        ])
        .toArray()
    ])
    const realTotalRows = totalRows[0]?.total || 0
    return {
      permissions,
      page,
      limit,
      totalRows: realTotalRows,
      totalPage: Math.ceil(realTotalRows / limit)
    }
  }

  async getPermissionsByUserId({ userId, query }: { userId: ObjectId; query: PaginationReqQuery }) {
    const { page, limit, skip } = paginationConfig(query)
    const match = { userId }
    const [permissions, totalRows] = await Promise.all([
      databaseService.userRoles
        .aggregate([
          {
            $match: match
          },
          {
            $lookup: {
              from: 'roles',
              localField: 'roleId',
              foreignField: '_id',
              as: 'role'
            }
          },
          {
            $unwind: {
              path: '$role'
            }
          },
          {
            $replaceRoot: {
              newRoot: '$role'
            }
          },
          {
            $project: {
              userId: 0
            }
          },
          {
            $sort: {
              createdAt: -1
            }
          },
          {
            $skip: skip
          },
          {
            $limit: limit
          }
        ])
        .toArray(),
      databaseService.userRoles.countDocuments(match)
    ])
    return {
      permissions,
      page,
      limit,
      totalRows,
      totalPages: Math.ceil(totalRows / limit)
    }
  }
}

const roleService = new RoleService()
export default roleService
