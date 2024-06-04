import { Router } from 'express'

import {
  createPostController,
  deletePostController,
  getPublicPostsController,
  updatePostController
} from '~/controllers/posts.controllers'
import { filterReqBodyMiddleware, paginationValidator } from '~/middlewares/common.middlewares'
import {
  createPostRoleValidator,
  createPostValidator,
  deletePostRoleValidator,
  postIdValidator,
  updatePostRoleValidator,
  updatePostValidator
} from '~/middlewares/posts.middlewares'
import { accessTokenValidator, isVerifiedUserValidator } from '~/middlewares/users.middlewares'
import { CreatePostReqBody, UpdatePostReqBody } from '~/models/requests/Post.requests'
import { wrapRequestHandler } from '~/utils/handler'

const postsRouter = Router()

postsRouter.post(
  '/',
  accessTokenValidator,
  isVerifiedUserValidator,
  createPostRoleValidator,
  createPostValidator,
  filterReqBodyMiddleware<CreatePostReqBody>([
    'approvalStatus',
    'content',
    'description',
    'orderNumber',
    'status',
    'thumbnail',
    'title'
  ]),
  wrapRequestHandler(createPostController)
)

postsRouter.patch(
  '/:postId',
  accessTokenValidator,
  isVerifiedUserValidator,
  updatePostRoleValidator,
  postIdValidator,
  updatePostValidator,
  filterReqBodyMiddleware<UpdatePostReqBody>([
    'approvalStatus',
    'content',
    'description',
    'orderNumber',
    'status',
    'thumbnail',
    'title'
  ]),
  wrapRequestHandler(updatePostController)
)

postsRouter.delete(
  '/:postId',
  accessTokenValidator,
  isVerifiedUserValidator,
  deletePostRoleValidator,
  postIdValidator,
  wrapRequestHandler(deletePostController)
)

postsRouter.get('/', paginationValidator, wrapRequestHandler(getPublicPostsController))

export default postsRouter
