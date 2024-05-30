import isUndefined from 'lodash/isUndefined'
import omitBy from 'lodash/omitBy'
import { ObjectId, WithId } from 'mongodb'

import { ENV_CONFIG } from '~/constants/config'
import { ProductApprovalStatus, ProductStatus, UserType } from '~/constants/enum'
import Product, { ProductSpecification } from '~/models/databases/Product.database'
import { CreateProductReqBody, GetProductsReqQuery } from '~/models/requests/Product.requests'
import databaseService from '~/services/database.services'
import fileService from '~/services/files.services'
import { paginationConfig } from '~/utils/utils'

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

  aggregateProduct() {
    return [
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'author'
        }
      },
      {
        $unwind: {
          path: '$author'
        }
      },
      {
        $lookup: {
          from: 'files',
          localField: 'author.avatar',
          foreignField: '_id',
          as: 'authorAvatar'
        }
      },
      {
        $unwind: {
          path: '$authorAvatar',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'productCategories',
          localField: 'productCategoryId',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $unwind: {
          path: '$category'
        }
      },
      {
        $lookup: {
          from: 'files',
          localField: 'category.thumbnail',
          foreignField: '_id',
          as: 'categoryThumbnail'
        }
      },
      {
        $unwind: {
          path: '$categoryThumbnail'
        }
      },
      {
        $lookup: {
          from: 'brands',
          localField: 'brandId',
          foreignField: '_id',
          as: 'brand'
        }
      },
      {
        $unwind: {
          path: '$brand'
        }
      },
      {
        $lookup: {
          from: 'files',
          localField: 'brand.thumbnail',
          foreignField: '_id',
          as: 'brandThumbnail'
        }
      },
      {
        $unwind: {
          path: '$brandThumbnail'
        }
      },
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
        $lookup: {
          from: 'files',
          localField: 'photos',
          foreignField: '_id',
          as: 'photos'
        }
      },
      {
        $addFields: {
          'author.avatar': {
            $cond: {
              if: '$authorAvatar',
              then: {
                $concat: [ENV_CONFIG.HOST, '/', ENV_CONFIG.STATIC_IMAGES_PATH, '/', '$authorAvatar.name']
              },
              else: ''
            }
          },
          'category.thumbnail': {
            $concat: [ENV_CONFIG.HOST, '/', ENV_CONFIG.STATIC_IMAGES_PATH, '/', '$categoryThumbnail.name']
          },
          'brand.thumbnail': {
            $concat: [ENV_CONFIG.HOST, '/', ENV_CONFIG.STATIC_IMAGES_PATH, '/', '$brandThumbnail.name']
          },
          thumbnailClone: {
            _id: '$thumbnail._id',
            url: {
              $concat: [ENV_CONFIG.HOST, '/', ENV_CONFIG.STATIC_IMAGES_PATH, '/', '$thumbnail.name']
            }
          },
          photos: {
            $map: {
              input: '$photos',
              as: 'photo',
              in: {
                _id: '$$photo._id',
                url: {
                  $concat: [ENV_CONFIG.HOST, '/', ENV_CONFIG.STATIC_IMAGES_PATH, '/', '$$photo.name']
                }
              }
            }
          }
        }
      },
      {
        $group: {
          _id: '$_id',
          name: {
            $first: '$name'
          },
          thumbnail: {
            $first: '$thumbnailClone'
          },
          originalPrice: {
            $first: '$originalPrice'
          },
          priceAfterDiscount: {
            $first: '$priceAfterDiscount'
          },
          status: {
            $first: '$status'
          },
          approvalStatus: {
            $first: '$approvalStatus'
          },
          orderNumber: {
            $first: '$orderNumber'
          },
          specifications: {
            $first: '$specifications'
          },
          photos: {
            $first: '$photos'
          },
          author: {
            $first: '$author'
          },
          category: {
            $first: '$category'
          },
          brand: {
            $first: '$brand'
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
          'author.password': 0,
          'author.phoneNumber': 0,
          'author.addresses': 0,
          'author.defaultAddress': 0,
          'author.verifyEmailToken': 0,
          'author.forgotPasswordToken': 0,
          'author.type': 0,
          'author.gender': 0,
          'author.status': 0,
          'author.verify': 0,
          'category.userId': 0,
          'category.status': 0,
          'category.orderNumber': 0,
          'category.description': 0,
          'brand.userId': 0,
          'brand.status': 0,
          'brand.orderNumber': 0,
          'brand.description': 0
        }
      }
    ]
  }

  async findMany(query: GetProductsReqQuery) {
    const { page, limit, skip } = paginationConfig(query)
    const { categoryId, brandId, lowestPrice, highestPrice } = query
    const match = omitBy(
      {
        status: ProductStatus.Active,
        approvalStatus: ProductApprovalStatus.Approved,
        productCategoryId: categoryId ? new ObjectId(categoryId) : undefined,
        brandId: brandId ? new ObjectId(brandId) : undefined,
        $and: [
          lowestPrice
            ? {
                priceAfterDiscount: {
                  $gte: Number(lowestPrice)
                }
              }
            : {},
          highestPrice
            ? {
                priceAfterDiscount: {
                  $lte: Number(highestPrice)
                }
              }
            : {}
        ]
      },
      isUndefined
    )
    const aggregate = [
      {
        $match: match
      },
      ...this.aggregateProduct(),
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
    const [products, totalRows] = await Promise.all([
      databaseService.products.aggregate(aggregate).toArray(),
      databaseService.products.countDocuments(match)
    ])
    return {
      products,
      page,
      limit,
      totalRows,
      totalPages: Math.ceil(totalRows / limit)
    }
  }

  async findAll(query: GetProductsReqQuery) {
    const { page, limit, skip } = paginationConfig(query)
    const { categoryId, brandId, lowestPrice, highestPrice } = query
    const match = omitBy(
      {
        productCategoryId: categoryId ? new ObjectId(categoryId) : undefined,
        brandId: brandId ? new ObjectId(brandId) : undefined,
        $and: [
          lowestPrice
            ? {
                priceAfterDiscount: {
                  $gte: Number(lowestPrice)
                }
              }
            : {},
          highestPrice
            ? {
                priceAfterDiscount: {
                  $lte: Number(highestPrice)
                }
              }
            : {}
        ]
      },
      isUndefined
    )
    const aggregate = [
      {
        $match: match
      },
      ...this.aggregateProduct(),
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
    const [products, totalRows] = await Promise.all([
      databaseService.products.aggregate(aggregate).toArray(),
      databaseService.products.countDocuments(match)
    ])
    return {
      products,
      page,
      limit,
      totalRows,
      totalPages: Math.ceil(totalRows / limit)
    }
  }

  async findById(productId: ObjectId) {
    const aggregate = [
      {
        $match: {
          _id: productId
        }
      },
      ...this.aggregateProduct()
    ]
    const products = await databaseService.products.aggregate(aggregate).toArray()
    return {
      product: products[0]
    }
  }
}

const productService = new ProductService()
export default productService
