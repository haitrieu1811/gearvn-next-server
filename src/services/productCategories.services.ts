import { ObjectId } from 'mongodb'

import ProductCategory from '~/models/databases/ProductCategory.database'
import { CreateProductCategoryReqBody } from '~/models/requests/ProductCategory.requests'
import databaseService from '~/services/database.services'

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
}

const productCategoryService = new ProductCategoryService()
export default productCategoryService
