import { Router } from 'express'

import { createPostController } from '~/controllers/posts.controllers'
import { filterReqBodyMiddleware } from '~/middlewares/common.middlewares'
import { createPostRoleValidator, createPostValidator } from '~/middlewares/posts.middlewares'
import { accessTokenValidator, isVerifiedUserValidator } from '~/middlewares/users.middlewares'
import { CreatePostReqBody } from '~/models/requests/Post.requests'
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

export default postsRouter
