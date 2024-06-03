import isUndefined from 'lodash/isUndefined'
import omitBy from 'lodash/omitBy'
import { ObjectId, WithId } from 'mongodb'

import { PostApprovalStatus, UserType } from '~/constants/enum'
import Post from '~/models/databases/Post.database'
import { CreatePostReqBody, UpdatePostReqBody } from '~/models/requests/Post.requests'
import databaseService from '~/services/database.services'
import fileService from '~/services/files.services'

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

  async update({ data, post }: { data: UpdatePostReqBody; post: WithId<Post> }) {
    const configuredData = omitBy(
      {
        ...data,
        thumbnail: data.thumbnail ? new ObjectId(data.thumbnail) : undefined
      },
      isUndefined
    )
    const updatedPost = await databaseService.posts.findOneAndUpdate(
      {
        _id: post._id
      },
      {
        $set: configuredData,
        $currentDate: {
          updatedAt: true
        }
      },
      {
        returnDocument: 'after'
      }
    )
    if (configuredData.thumbnail && updatedPost?.thumbnail.toString() !== post.thumbnail.toString()) {
      await fileService.deleteImage(post.thumbnail)
    }
    return {
      post: updatedPost
    }
  }
}

const postService = new PostService()
export default postService
