import { ObjectId } from 'mongodb'

import Review from '~/models/databases/Review.database'
import { CreateReviewReqBody, ReplyReviewReqBody } from '~/models/requests/Review.requests'
import databaseService from '~/services/database.services'

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
}

const reviewService = new ReviewService()
export default reviewService
