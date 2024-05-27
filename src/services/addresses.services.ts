import { ObjectId, WithId } from 'mongodb'

import Address from '~/models/databases/Address.database'
import User from '~/models/databases/User.database'
import { CreateAddressReqBody } from '~/models/requests/Address.requests'
import { PaginationReqQuery } from '~/models/requests/Common.requests'
import databaseService from '~/services/database.services'
import { paginationConfig } from '~/utils/utils'

class AddressService {
  async getAllProvinces() {
    const provinces = await databaseService.provinces
      .find(
        {},
        {
          projection: {
            id: 0,
            districts: 0
          }
        }
      )
      .toArray()
    return {
      provinces,
      totalRows: provinces.length
    }
  }

  async getDistrictsByProvinceId(provinceId: string) {
    const districts = await databaseService.provinces
      .aggregate([
        {
          $match: {
            _id: new ObjectId(provinceId)
          }
        },
        {
          $unwind: {
            path: '$districts'
          }
        },
        {
          $replaceRoot: {
            newRoot: '$districts'
          }
        },
        {
          $project: {
            wards: 0,
            streets: 0,
            projects: 0
          }
        }
      ])
      .toArray()
    return {
      districts,
      totalRows: districts.length
    }
  }

  async getWardsByProvinceAndDistrictId({ provinceId, districtId }: { provinceId: string; districtId: string }) {
    const wards = await databaseService.provinces
      .aggregate([
        {
          $match: {
            _id: new ObjectId(provinceId)
          }
        },
        {
          $addFields: {
            district: {
              $filter: {
                input: '$districts',
                as: 'district',
                cond: {
                  $eq: ['$$district.id', districtId]
                }
              }
            }
          }
        },
        {
          $unwind: {
            path: '$district'
          }
        },
        {
          $unwind: {
            path: '$district.wards'
          }
        },
        {
          $replaceRoot: {
            newRoot: '$district.wards'
          }
        }
      ])
      .toArray()
    return {
      wards,
      totalRows: wards.length
    }
  }

  async getStreetsByProvinceAndDistrictId({ provinceId, districtId }: { provinceId: string; districtId: string }) {
    const streets = await databaseService.provinces
      .aggregate([
        {
          $match: {
            _id: new ObjectId(provinceId)
          }
        },
        {
          $addFields: {
            district: {
              $filter: {
                input: '$districts',
                as: 'district',
                cond: {
                  $eq: ['$$district.id', districtId]
                }
              }
            }
          }
        },
        {
          $unwind: {
            path: '$district'
          }
        },
        {
          $unwind: {
            path: '$district.streets'
          }
        },
        {
          $replaceRoot: {
            newRoot: '$district.streets'
          }
        }
      ])
      .toArray()
    return {
      streets,
      totalRows: streets.length
    }
  }

  async create({ data, userId }: { data: CreateAddressReqBody; userId: ObjectId }) {
    const { insertedId } = await databaseService.addresses.insertOne(
      new Address({
        ...data,
        provinceId: new ObjectId(data.provinceId),
        userId
      })
    )
    const [insertedAddress] = await Promise.all([
      databaseService.addresses.findOne({ _id: insertedId }),
      databaseService.users.updateOne(
        {
          _id: userId
        },
        {
          $push: {
            addresses: insertedId
          },
          $currentDate: {
            updatedAt: true
          }
        }
      )
    ])
    return {
      address: insertedAddress
    }
  }

  async update({ data, addressId }: { data: CreateAddressReqBody; addressId: ObjectId }) {
    const updatedAddress = await databaseService.addresses.findOneAndUpdate(
      {
        _id: addressId
      },
      {
        $set: {
          ...data,
          provinceId: new ObjectId(data.provinceId)
        },
        $currentDate: {
          updatedAt: true
        }
      },
      {
        returnDocument: 'after',
        projection: {
          userId: 0
        }
      }
    )
    return {
      address: updatedAddress
    }
  }

  async setDefault({ addressId, userId }: { addressId: ObjectId; userId: ObjectId }) {
    await databaseService.users.findOneAndUpdate(
      {
        _id: userId
      },
      {
        $set: {
          defaultAddress: addressId
        },
        $currentDate: {
          updatedAt: true
        }
      },
      {
        returnDocument: 'after',
        projection: {
          userId: 0
        }
      }
    )
    return true
  }

  private aggregateAddress() {
    return [
      {
        $lookup: {
          from: 'provinces',
          localField: 'provinceId',
          foreignField: '_id',
          as: 'province'
        }
      },
      {
        $unwind: {
          path: '$province'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: 'defaultAddress',
          as: 'defaultAddress'
        }
      },
      {
        $addFields: {
          district: {
            $filter: {
              input: '$province.districts',
              as: 'district',
              cond: {
                $eq: ['$$district.id', '$districtId']
              }
            }
          },
          isDefaultAddress: {
            $cond: {
              if: {
                $size: '$defaultAddress'
              },
              then: true,
              else: false
            }
          }
        }
      },
      {
        $unwind: {
          path: '$district'
        }
      },
      {
        $addFields: {
          ward: {
            $filter: {
              input: '$district.wards',
              as: 'ward',
              cond: {
                $eq: ['$$ward.id', '$wardId']
              }
            }
          },
          street: {
            $filter: {
              input: '$district.streets',
              as: 'street',
              cond: {
                $eq: ['$$street.id', '$streetId']
              }
            }
          }
        }
      },
      {
        $unwind: {
          path: '$ward'
        }
      },
      {
        $unwind: {
          path: '$street'
        }
      },
      {
        $group: {
          _id: '$_id',
          fullName: {
            $first: '$fullName'
          },
          phoneNumber: {
            $first: '$phoneNumber'
          },
          province: {
            $first: '$province'
          },
          district: {
            $first: '$district'
          },
          ward: {
            $first: '$ward'
          },
          street: {
            $first: '$street'
          },
          addressDetail: {
            $first: '$addressDetail'
          },
          type: {
            $first: '$type'
          },
          isDefaultAddress: {
            $first: '$isDefaultAddress'
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
        $project: {
          'province.id': 0,
          'province.districts': 0,
          'district.wards': 0,
          'district.streets': 0,
          'district.projects': 0
        }
      }
    ]
  }

  async getMyAddresses({ userId, query }: { userId: ObjectId; query: PaginationReqQuery }) {
    const { page, limit, skip } = paginationConfig(query)
    const match = { userId }
    const aggregate = [
      {
        $match: match
      },
      ...this.aggregateAddress(),
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
    ]
    const [addresses, totalRows] = await Promise.all([
      databaseService.addresses.aggregate(aggregate).toArray(),
      databaseService.addresses.countDocuments(match)
    ])
    return {
      addresses,
      page,
      limit,
      totalRows,
      totalPages: Math.ceil(totalRows / limit)
    }
  }

  async findById(addressId: ObjectId) {
    const aggregate = [
      {
        $match: {
          _id: addressId
        }
      },
      ...this.aggregateAddress()
    ]
    const addresses = await databaseService.addresses.aggregate(aggregate).toArray()
    return {
      address: addresses[0]
    }
  }

  async delete({ addressId, userId }: { addressId: ObjectId; userId: ObjectId }) {
    const user = (await databaseService.users.findOne({ _id: userId })) as WithId<User>
    const newDefaultAddress = user.defaultAddress?.toString() === addressId.toString() ? null : user.defaultAddress
    await Promise.all([
      databaseService.addresses.deleteOne({ _id: addressId }),
      databaseService.users.updateOne(
        {
          _id: userId
        },
        {
          $pull: {
            addresses: addressId
          },
          $set: {
            defaultAddress: newDefaultAddress
          },
          $currentDate: {
            updatedAt: true
          }
        }
      )
    ])
    return true
  }
}

const addressService = new AddressService()
export default addressService
