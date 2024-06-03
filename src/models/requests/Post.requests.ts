import { ParamsDictionary } from 'express-serve-static-core'

import { PostApprovalStatus, PostStatus } from '~/constants/enum'

export type CreatePostReqBody = {
  title: string
  content: string
  description: string
  thumbnail: string
  orderNumber?: number
  status?: PostStatus
  approvalStatus?: PostApprovalStatus
}

export type UpdatePostReqBody = Partial<CreatePostReqBody>

export type PostIdReqParams = ParamsDictionary & {
  postId: string
}
