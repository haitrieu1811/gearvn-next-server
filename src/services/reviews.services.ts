import isUndefined from 'lodash/isUndefined'
import omitBy from 'lodash/omitBy'
import { ObjectId, WithId } from 'mongodb'

import Review from '~/models/databases/Review.database'
import { CreateReviewReqBody, ReplyReviewReqBody, UpdateReviewReqBody } from '~/models/requests/Review.requests'
import databaseService from '~/services/database.services'
import fileService from '~/services/files.services'

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
}

const reviewService = new ReviewService()
export default reviewService
