import { Request, Response } from 'express'
import { ObjectId, WithId } from 'mongodb'
import { ParamsDictionary } from 'express-serve-static-core'

import { REVIEWS_MESSAGES } from '~/constants/message'
import Review from '~/models/databases/Review.database'
import { PaginationReqQuery } from '~/models/requests/Common.requests'
import { ProductIdReqParams } from '~/models/requests/Product.requests'
import {
  CreateReviewReqBody,
  ReplyReviewReqBody,
  ReviewIdReqParams,
  UpdateReviewReqBody
} from '~/models/requests/Review.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import reviewService from '~/services/reviews.services'

export const createReviewController = async (
  req: Request<ProductIdReqParams, any, CreateReviewReqBody>,
  res: Response
) => {
  const { userId } = req.decodedAuthorization as TokenPayload
  const result = await reviewService.create({
    data: req.body,
    userId: new ObjectId(userId),
    productId: new ObjectId(req.params.productId)
  })
  return res.json({
    message: REVIEWS_MESSAGES.CREATE_REVIEW_SUCCESS,
    data: result
  })
}

export const replyReviewController = async (
  req: Request<ReviewIdReqParams, any, ReplyReviewReqBody>,
  res: Response
) => {
  const { userId } = req.decodedAuthorization as TokenPayload
  const review = req.review as WithId<Review>
  const result = await reviewService.reply({
    data: req.body,
    userId: new ObjectId(userId),
    productId: new ObjectId(review.productId),
    reviewId: new ObjectId(req.params.reviewId)
  })
  return res.json({
    message: REVIEWS_MESSAGES.REPLY_REVIEW_SUCCESS,
    data: result
  })
}

export const updateReviewController = async (
  req: Request<ReviewIdReqParams, any, UpdateReviewReqBody>,
  res: Response
) => {
  const review = req.review as WithId<Review>
  const result = await reviewService.update({
    data: req.body,
    review
  })
  return res.json({
    message: REVIEWS_MESSAGES.UPDATE_REVIEW_SUCCESS,
    data: result
  })
}

export const getReviewByProductIdController = async (
  req: Request<ProductIdReqParams, any, any, PaginationReqQuery>,
  res: Response
) => {
  const { reviews, ...pagination } = await reviewService.findMany({
    query: req.query,
    match: {
      productId: new ObjectId(req.params.productId),
      parentId: null
    }
  })
  return res.json({
    message: REVIEWS_MESSAGES.GET_REVIEWS_SUCCESS,
    data: {
      reviews,
      pagination
    }
  })
}

export const getReviewDetailController = async (req: Request<ReviewIdReqParams>, res: Response) => {
  const result = await reviewService.findById(new ObjectId(req.params.reviewId))
  return res.json({
    message: REVIEWS_MESSAGES.GET_REVIEW_DETAIL_SUCCESS,
    data: result
  })
}

export const getAllReviewsController = async (
  req: Request<ParamsDictionary, any, any, PaginationReqQuery>,
  res: Response
) => {
  const { reviews, ...pagination } = await reviewService.findMany({
    query: req.query,
    match: {
      parentId: null
    }
  })
  return res.json({
    message: REVIEWS_MESSAGES.GET_ALL_REVIEWS_SUCCESS,
    data: {
      reviews,
      pagination
    }
  })
}

export const getReviewRepliesController = async (
  req: Request<ReviewIdReqParams, any, any, PaginationReqQuery>,
  res: Response
) => {
  const { reviews, ...pagination } = await reviewService.findMany({
    query: req.query,
    match: {
      parentId: new ObjectId(req.params.reviewId)
    }
  })
  return res.json({
    message: REVIEWS_MESSAGES.GET_REVIEW_REPLIES_SUCCESS,
    data: {
      reviews,
      pagination
    }
  })
}
