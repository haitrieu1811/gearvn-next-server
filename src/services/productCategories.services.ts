import isUndefined from 'lodash/isUndefined'
import omitBy from 'lodash/omitBy'
import { ObjectId } from 'mongodb'

import { ENV_CONFIG } from '~/constants/config'
import { ProductCategoryStatus } from '~/constants/enum'
import ProductCategory from '~/models/databases/ProductCategory.database'
import { PaginationReqQuery } from '~/models/requests/Common.requests'
import { CreateProductCategoryReqBody, UpdateProductCategoryReqBody } from '~/models/requests/ProductCategory.requests'
import databaseService from '~/services/database.services'
import fileService from '~/services/files.services'
import { paginationConfig } from '~/utils/utils'

class ProductCategoryService {
  async create({ data, userId }: { data: CreateProductCategoryReqBody; userId: ObjectId }) {
    const { insertedId } = await databaseService.productCategories.insertOne(
      new ProductCategory({
        ...data,
        userId,
        thumbnail: new ObjectId(data.thumbnail)
      })
    )
    const insertedProductCategory = await databaseService.productCategories.findOne({ _id: insertedId })
    return {
      productCategory: insertedProductCategory
    }
  }

  async update({ data, productCategoryId }: { data: UpdateProductCategoryReqBody; productCategoryId: ObjectId }) {
    const configuredData = omitBy(
      {
        ...data,
        thumbnail: data.thumbnail ? new ObjectId(data.thumbnail) : undefined
      },
      isUndefined
    )
    const updatedProductCategory = await databaseService.productCategories.findOneAndUpdate(
      {
        _id: productCategoryId
      },
      {
        $set: configuredData,
        $currentDate: {
          updatedAt: true
        }
      }
    )
    if (updatedProductCategory && updatedProductCategory.thumbnail !== configuredData.thumbnail) {
      await fileService.deleteImage(updatedProductCategory.thumbnail)
    }
    const productCategory = await databaseService.productCategories.findOne({ _id: productCategoryId })
    return {
      productCategory
    }
  }

  private aggregateProductCategory() {
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
    const match = { status: ProductCategoryStatus.Active }
    const aggregate = [
      {
        $match: match
      },
      ...this.aggregateProductCategory(),
      {
        $sort: {
          orderNumber: 1
        }
      },
      {
        $skip: skip
      },
      {
        $limit: limit
      }
    ]
    const [productCategories, totalRows] = await Promise.all([
      databaseService.productCategories.aggregate(aggregate).toArray(),
      databaseService.productCategories.countDocuments(match)
    ])
    return {
      productCategories,
      page,
      limit,
      totalRows,
      totalPages: Math.ceil(totalRows / limit)
    }
  }

  async findAll(query: PaginationReqQuery) {
    const { page, limit, skip } = paginationConfig(query)

    const aggregate = [
      ...this.aggregateProductCategory(),
      {
        $sort: {
          orderNumber: 1
        }
      },
      {
        $skip: skip
      },
      {
        $limit: limit
      }
    ]
    const [productCategories, totalRows] = await Promise.all([
      databaseService.productCategories.aggregate(aggregate).toArray(),
      databaseService.productCategories.countDocuments({})
    ])
    return {
      productCategories,
      page,
      limit,
      totalRows,
      totalPages: Math.ceil(totalRows / limit)
    }
  }
}

const productCategoryService = new ProductCategoryService()
export default productCategoryService
