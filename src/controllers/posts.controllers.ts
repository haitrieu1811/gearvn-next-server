import { Request, Response } from 'express'
import { ObjectId } from 'mongodb'

import { POSTS_MESSAGES } from '~/constants/message'
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
