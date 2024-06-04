import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId, WithId } from 'mongodb'

import { PostApprovalStatus, PostStatus } from '~/constants/enum'
import { POSTS_MESSAGES } from '~/constants/message'
import Post from '~/models/databases/Post.database'
import { PaginationReqQuery } from '~/models/requests/Common.requests'
import { PostIdReqParams, UpdatePostReqBody } from '~/models/requests/Post.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import postService from '~/services/posts.services'

export const createPostController = async (req: Request, res: Response) => {
  const { userId, userType } = req.decodedAuthorization as TokenPayload
  const result = await postService.create({
    data: req.body,
    userId: new ObjectId(userId),
    userType
  })
  return res.json({
    message: POSTS_MESSAGES.CREATE_POST_SUCCESS,
    data: result
  })
}

export const updatePostController = async (req: Request<PostIdReqParams, any, UpdatePostReqBody>, res: Response) => {
  const post = req.post as WithId<Post>
  const result = await postService.update({
    post,
    data: req.body
  })
  return res.json({
    message: POSTS_MESSAGES.UPDATE_POST_SUCCESS,
    data: result
  })
}

export const deletePostController = async (req: Request<PostIdReqParams>, res: Response) => {
  await postService.delete(new ObjectId(req.params.postId))
  return res.json({
    message: POSTS_MESSAGES.DELETE_POST_SUCCESS
  })
}

export const getPublicPostsController = async (
  req: Request<ParamsDictionary, any, any, PaginationReqQuery>,
  res: Response
) => {
  const { posts, ...pagination } = await postService.findMany({
    query: req.query,
    match: {
      status: PostStatus.Active,
      approvalStatus: PostApprovalStatus.Approved
    }
  })
  return res.json({
    message: POSTS_MESSAGES.GET_PUBLIC_POSTS_SUCCESS,
    data: {
      posts,
      pagination
    }
  })
}

export const getAllPostsController = async (
  req: Request<ParamsDictionary, any, any, PaginationReqQuery>,
  res: Response
) => {
  const { posts, ...pagination } = await postService.findMany({ query: req.query })
  return res.json({
    message: POSTS_MESSAGES.GET_ALL_POSTS_SUCCESS,
    data: {
      posts,
      pagination
    }
  })
}

export const getPostDetailController = async (req: Request<PostIdReqParams>, res: Response) => {
  const result = await postService.findById(new ObjectId(req.params.postId))
  return res.json({
    message: POSTS_MESSAGES.GET_POST_DETAIL_SUCCESS,
    data: result
  })
}
