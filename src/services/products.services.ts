import { ObjectId } from 'mongodb'
import omit from 'lodash/omit'

import { ProductApprovalStatus, UserType } from '~/constants/enum'
import Product, { ProductSpecification } from '~/models/databases/Product.database'
import { CreateProductReqBody } from '~/models/requests/Product.requests'
import databaseService from '~/services/database.services'

class ProductService {
  async create({ data, userId, userType }: { data: CreateProductReqBody; userId: ObjectId; userType: UserType }) {
    const approvalStatus =
      userType === UserType.Admin ? ProductApprovalStatus.Approved : ProductApprovalStatus.Unapproved
    const specifications = data.specifications?.map(
      (specification) =>
        new ProductSpecification({
          key: specification.key,
          value: specification.value
        })
    )
    const { insertedId } = await databaseService.products.insertOne(
      new Product({
        ...data,
        productCategoryId: new ObjectId(data.productCategoryId),
        brandId: new ObjectId(data.brandId),
        thumbnail: new ObjectId(data.thumbnail),
        photos: data.photos.map((photo) => new ObjectId(photo)),
        approvalStatus,
        specifications,
        userId
      })
    )
    const insertedProduct = await databaseService.products.findOne({ _id: insertedId })
    return {
      product: insertedProduct
    }
  }

  async update({ data, productId }: { data: CreateProductReqBody; productId: ObjectId }) {
    const specifications = data.specifications?.map(
      (specification) =>
        new ProductSpecification({
          key: specification.key,
          value: specification.value
        })
    )
    const updatedProduct = await databaseService.products.findOneAndUpdate(
      {
        _id: productId
      },
      {
        $set: {
          ...data,
          productCategoryId: new ObjectId(data.productCategoryId),
          brandId: new ObjectId(data.brandId),
          photos: data.photos.map((photo) => new ObjectId(photo)),
          thumbnail: new ObjectId(data.thumbnail),
          specifications
        },
        $currentDate: {
          updatedAt: true
        }
      },
      {
        returnDocument: 'after'
      }
    )
    return {
      product: updatedProduct
    }
  }
}

const productService = new ProductService()
export default productService
