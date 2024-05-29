import { ObjectId, WithId } from 'mongodb'

import { ProductApprovalStatus, UserType } from '~/constants/enum'
import Product, { ProductSpecification } from '~/models/databases/Product.database'
import { CreateProductReqBody } from '~/models/requests/Product.requests'
import databaseService from '~/services/database.services'
import fileService from '~/services/files.services'

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
    const beforeProduct = (await databaseService.products.findOne({ _id: productId })) as WithId<Product>
    const updatedProduct = (await databaseService.products.findOneAndUpdate(
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
    )) as WithId<Product>
    if (updatedProduct.thumbnail.toString() !== beforeProduct.thumbnail.toString()) {
      await fileService.deleteImage(beforeProduct.thumbnail)
    }
    const newPhotosToString = updatedProduct.photos.map((photo) => photo.toString())
    const deletedImages = beforeProduct.photos.filter((photo) => !newPhotosToString.includes(photo.toString()))
    if (deletedImages.length > 0) {
      await Promise.all(
        deletedImages.map(async (imageId) => {
          await fileService.deleteImage(imageId)
        })
      )
    }
    return {
      product: updatedProduct
    }
  }

  async delete(productId: ObjectId) {
    const deletedProduct = await databaseService.products.findOneAndDelete({ _id: productId })
    if (deletedProduct) {
      await Promise.all(
        [deletedProduct.thumbnail, ...deletedProduct.photos].map(async (photo) => {
          await fileService.deleteImage(photo)
        })
      )
    }
    return true
  }
}

const productService = new ProductService()
export default productService
