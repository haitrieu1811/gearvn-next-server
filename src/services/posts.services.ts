import { ObjectId } from 'mongodb'

import { PostApprovalStatus, UserType } from '~/constants/enum'
import Post from '~/models/databases/Post.database'
import { CreatePostReqBody } from '~/models/requests/Post.requests'
import databaseService from '~/services/database.services'

class PostService {
  async create({ data, userId, userType }: { data: CreatePostReqBody; userId: ObjectId; userType: UserType }) {
    const approvalStatus = userType === UserType.Admin ? PostApprovalStatus.Approved : PostApprovalStatus.Unapproved
    const { insertedId } = await databaseService.posts.insertOne(
      new Post({
        ...data,
        thumbnail: new ObjectId(data.thumbnail),
        approvalStatus,
        userId
      })
    )
    const insertedPost = await databaseService.posts.findOne({ _id: insertedId })
    return {
      post: insertedPost
    }
  }
}

const postService = new PostService()
export default postService
