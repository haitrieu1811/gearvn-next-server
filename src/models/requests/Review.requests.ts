import { ParamsDictionary } from 'express-serve-static-core'

import { StarPointType } from '~/models/databases/Review.database'

export type CreateReviewReqBody = {
  starPoint: StarPointType
  content?: string
  photos?: string[]
}

export type ReplyReviewReqBody = {
  content: string
}

export type ReviewIdReqParams = ParamsDictionary & {
  reviewId: string
}
