import isUndefined from 'lodash/isUndefined'
import omitBy from 'lodash/omitBy'
import { ObjectId } from 'mongodb'

import { ENV_CONFIG } from '~/constants/config'
import { BrandStatus } from '~/constants/enum'
import Brand from '~/models/databases/Brand.database'
import { CreateBrandReqBody, UpdateBrandReqBody } from '~/models/requests/Brand.requests'
import { PaginationReqQuery } from '~/models/requests/Common.requests'
import databaseService from '~/services/database.services'
import fileService from '~/services/files.services'
import { paginationConfig } from '~/utils/utils'

class BrandService {
  async create({ data, userId }: { data: CreateBrandReqBody; userId: ObjectId }) {
    const { insertedId } = await databaseService.brands.insertOne(
      new Brand({
        ...data,
        userId,
        thumbnail: new ObjectId(data.thumbnail)
      })
    )
    const insertedBrand = await databaseService.brands.findOne({ _id: insertedId })
    return {
      brand: insertedBrand
    }
  }

  async update({ data, brandId }: { data: UpdateBrandReqBody; brandId: ObjectId }) {
    const configuredData = omitBy(
      {
        ...data,
        thumbnail: data.thumbnail ? new ObjectId(data.thumbnail) : undefined
      },
      isUndefined
    )
    const updatedBrand = await databaseService.brands.findOneAndUpdate(
      {
        _id: brandId
      },
      {
        $set: configuredData,
        $currentDate: {
          updatedAt: true
        }
      }
    )
    if (
      updatedBrand &&
      configuredData.thumbnail &&
      updatedBrand.thumbnail.toString() !== configuredData.thumbnail.toString()
    ) {
      await fileService.deleteImage(updatedBrand.thumbnail)
    }
    const brand = await databaseService.brands.findOne({ _id: brandId })
    return {
      brand
    }
  }

  private aggregateBrand() {
    return [
      {
        $lookup: {
          from: 'files',
          localField: 'thumbnail',
          foreignField: '_id',
          as: 'thumbnail'
        }
      },
      {
        $unwind: {
          path: '$thumbnail'
        }
      },
      {
        $addFields: {
          thumbnail: {
            $concat: [ENV_CONFIG.HOST, '/', ENV_CONFIG.STATIC_IMAGES_PATH, '/', '$thumbnail.name']
          }
        }
      },
      {
        $project: {
          userId: 0
        }
      }
    ]
  }

  async findMany(query: PaginationReqQuery) {
    const { page, limit, skip } = paginationConfig(query)
    const match = { status: BrandStatus.Active }
    const aggregate = [
      {
        $match: match
      },
      ...this.aggregateBrand(),
      {
        $sort: {
          orderNumber: 1,
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
    const [brands, totalRows] = await Promise.all([
      databaseService.brands.aggregate(aggregate).toArray(),
      databaseService.brands.countDocuments(match)
    ])
    return {
      brands,
      page,
      limit,
      totalRows,
      totalPages: Math.ceil(totalRows / limit)
    }
  }

  async findAll(query: PaginationReqQuery) {
    const { page, limit, skip } = paginationConfig(query)
    const aggregate = [
      ...this.aggregateBrand(),
      {
        $sort: {
          orderNumber: 1,
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
    const [brands, totalRows] = await Promise.all([
      databaseService.brands.aggregate(aggregate).toArray(),
      databaseService.brands.countDocuments({})
    ])
    return {
      brands,
      page,
      limit,
      totalRows,
      totalPages: Math.ceil(totalRows / limit)
    }
  }

  async findById(brandId: ObjectId) {
    const aggregate = [
      {
        $match: {
          _id: brandId
        }
      },
      ...this.aggregateBrand()
    ]
    const brands = await databaseService.brands.aggregate(aggregate).toArray()
    return {
      brand: brands[0]
    }
  }

  async delete(brandId: ObjectId) {
    const deletedBrand = await databaseService.brands.findOneAndDelete({ _id: brandId })
    if (deletedBrand && deletedBrand.thumbnail) {
      await fileService.deleteImage(deletedBrand.thumbnail)
    }
    return true
  }
}

const brandService = new BrandService()
export default brandService
