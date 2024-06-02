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
