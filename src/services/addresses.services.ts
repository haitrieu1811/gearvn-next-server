import { ObjectId } from 'mongodb'

import Address from '~/models/databases/Address.database'
import { CreateAddressReqBody } from '~/models/requests/Address.requests'
import databaseService from '~/services/database.services'

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
}

const addressService = new AddressService()
export default addressService
