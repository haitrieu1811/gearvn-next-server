import isUndefined from 'lodash/isUndefined'
import omitBy from 'lodash/omitBy'
import { ObjectId, WithId } from 'mongodb'

import { ENV_CONFIG } from '~/constants/config'
import Review from '~/models/databases/Review.database'
import { PaginationReqQuery } from '~/models/requests/Common.requests'
import { CreateReviewReqBody, ReplyReviewReqBody, UpdateReviewReqBody } from '~/models/requests/Review.requests'
import databaseService from '~/services/database.services'
import fileService from '~/services/files.services'
import { paginationConfig } from '~/utils/utils'

class ReviewService {
  async create({ data, userId, productId }: { data: CreateReviewReqBody; userId: ObjectId; productId: ObjectId }) {
    const { insertedId } = await databaseService.reviews.insertOne(
      new Review({
        ...data,
        userId,
        productId,
        photos: data.photos?.map((photo) => new ObjectId(photo))
      })
    )
    const insertedReview = await databaseService.reviews.findOne({ _id: insertedId })
    return {
      review: insertedReview
    }
  }

  async reply({
    data,
    userId,
    productId,
    reviewId
  }: {
    data: ReplyReviewReqBody
    userId: ObjectId
    productId: ObjectId
    reviewId: ObjectId
  }) {
    const { insertedId } = await databaseService.reviews.insertOne(
      new Review({
        parentId: reviewId,
        userId,
        productId,
        content: data.content
      })
    )
    const review = await databaseService.reviews.findOne({ _id: insertedId })
    return {
      review
    }
  }

  async update({ data, review }: { data: UpdateReviewReqBody; review: WithId<Review> }) {
    const configuredData = omitBy(
      {
        ...data,
        photos: data.photos?.map((photo) => new ObjectId(photo))
      },
      isUndefined
    )
    const updatedReview = await databaseService.reviews.findOneAndUpdate(
      {
        _id: review._id
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
    if (configuredData.photos) {
      const updatedReviewPhotos = updatedReview?.photos.map((photo) => photo.toString()) || []
      const deletedPhotos = review.photos.filter((photo) => !updatedReviewPhotos.includes(photo.toString()))
      await Promise.all(
        deletedPhotos.map(async (photo) => {
          await fileService.deleteImage(photo)
        })
      )
    }
    return {
      review: updatedReview
    }
  }

  aggregateReview() {
    return [
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'product'
        }
      },
      {
        $unwind: {
          path: '$product'
        }
      },
      {
        $lookup: {
          from: 'files',
          localField: 'product.thumbnail',
          foreignField: '_id',
          as: 'productThumbnail'
        }
      },
      {
        $unwind: {
          path: '$productThumbnail'
        }
      },
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
          from: 'files',
          localField: 'photos',
          foreignField: '_id',
          as: 'photos'
        }
      },
      {
        $addFields: {
          'product.thumbnail': {
            $concat: [ENV_CONFIG.HOST, '/', ENV_CONFIG.STATIC_IMAGES_PATH, '/', '$productThumbnail.name']
          },
          'author.avatar': {
            $cond: {
              if: '$authorAvatar',
              then: {
                $concat: [ENV_CONFIG.HOST, '/', ENV_CONFIG.STATIC_IMAGES_PATH, '/', '$authorAvatar.name']
              },
              else: ''
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
          starPoint: {
            $first: '$starPoint'
          },
          content: {
            $first: '$content'
          },
          photos: {
            $first: '$photos'
          },
          author: {
            $first: '$author'
          },
          product: {
            $first: '$product'
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
          'author.type': 0,
          'author.gender': 0,
          'author.phoneNumber': 0,
          'author.addresses': 0,
          'author.defaultAddress': 0,
          'author.status': 0,
          'author.verify': 0,
          'author.verifyEmailToken': 0,
          'author.forgotPasswordToken': 0,
          'product.userId': 0,
          'product.productCategoryId': 0,
          'product.brandId': 0,
          'product.shortDescription': 0,
          'product.description': 0,
          'product.photos': 0,
          'product.orderNumber': 0,
          'product.specifications': 0,
          'product.status': 0,
          'product.approvalStatus': 0
        }
      }
    ]
  }

  async findMany({ query, match }: { query: PaginationReqQuery; match: any }) {
    const { page, limit, skip } = paginationConfig(query)
    const aggregate = [
      {
        $match: match
      },
      ...this.aggregateReview(),
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
    const [reviews, totalRows] = await Promise.all([
      databaseService.reviews.aggregate(aggregate).toArray(),
      databaseService.reviews.countDocuments(match)
    ])
    return {
      reviews,
      page,
      limit,
      totalRows,
      totalPages: Math.ceil(totalRows / limit)
    }
  }
}

const reviewService = new ReviewService()
export default reviewService
