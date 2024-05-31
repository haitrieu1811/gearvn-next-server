import { ObjectId } from 'mongodb'

import Review from '~/models/databases/Review.database'
import { CreateReviewReqBody } from '~/models/requests/Review.requests'
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
}

const reviewService = new ReviewService()
export default reviewService
