import { Router } from 'express'

import {
  createPostController,
  deletePostController,
  getAllPostsController,
  getPostDetailController,
  getPublicPostsController,
  updatePostController
} from '~/controllers/posts.controllers'
import { filterReqBodyMiddleware, paginationValidator } from '~/middlewares/common.middlewares'
import {
  createPostRoleValidator,
  createPostValidator,
  deletePostRoleValidator,
  isPublicPostValidator,
  postIdValidator,
  readAllPostsRoleValidator,
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

postsRouter.get(
  '/all',
  accessTokenValidator,
  isVerifiedUserValidator,
  readAllPostsRoleValidator,
  paginationValidator,
  wrapRequestHandler(getAllPostsController)
)

postsRouter.get(
  '/:postId/for-read',
  postIdValidator,
  isPublicPostValidator,
  wrapRequestHandler(getPostDetailController)
)

postsRouter.get(
  '/:postId/for-update',
  accessTokenValidator,
  isVerifiedUserValidator,
  updatePostRoleValidator,
  postIdValidator,
  wrapRequestHandler(getPostDetailController)
)

export default postsRouter
