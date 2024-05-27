import isUndefined from 'lodash/isUndefined'
import omitBy from 'lodash/omitBy'
import { ObjectId } from 'mongodb'

import ProductCategory from '~/models/databases/ProductCategory.database'
import { CreateProductCategoryReqBody, UpdateProductCategoryReqBody } from '~/models/requests/ProductCategory.requests'
import databaseService from '~/services/database.services'
import fileService from '~/services/files.services'

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
}

const productCategoryService = new ProductCategoryService()
export default productCategoryService
