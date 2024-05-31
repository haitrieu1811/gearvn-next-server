import { StarPointType } from '~/models/databases/Review.database'

export type CreateReviewReqBody = {
  starPoint: StarPointType
  content?: string
  photos?: string[]
}
