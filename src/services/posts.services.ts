import isUndefined from 'lodash/isUndefined'
import omitBy from 'lodash/omitBy'
import { ObjectId, WithId } from 'mongodb'

import { ENV_CONFIG } from '~/constants/config'
import { PostApprovalStatus, UserType } from '~/constants/enum'
import Post from '~/models/databases/Post.database'
import { PaginationReqQuery } from '~/models/requests/Common.requests'
import { CreatePostReqBody, UpdatePostReqBody } from '~/models/requests/Post.requests'
import databaseService from '~/services/database.services'
import fileService from '~/services/files.services'
import { paginationConfig } from '~/utils/utils'

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

  async delete(postId: ObjectId) {
    const deletedPost = (await databaseService.posts.findOneAndDelete({ _id: postId })) as WithId<Post>
    await fileService.deleteImage(deletedPost.thumbnail)
    return true
  }

  aggregatePost() {
    return [
      {
        $lookup: {
          from: 'files',
          localField: 'thumbnail',
          foreignField: '_id',
          as: 'thumbnail'
        }
      },
      {
        $unwind: {
          path: '$thumbnail'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'author'
        }
      },
      {
        $unwind: {
          path: '$author'
        }
      },
      {
        $lookup: {
          from: 'files',
          localField: 'author.avatar',
          foreignField: '_id',
          as: 'authorAvatar'
        }
      },
      {
        $unwind: {
          path: '$authorAvatar',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          thumbnail: {
            $concat: [ENV_CONFIG.HOST, '/', ENV_CONFIG.STATIC_IMAGES_PATH, '/', '$thumbnail.name']
          },
          'author.avatar': {
            $cond: {
              if: '$authorAvatar',
              then: {
                $concat: [ENV_CONFIG.HOST, '/', ENV_CONFIG.STATIC_IMAGES_PATH, '/', '$authorAvatar.name']
              },
              else: ''
            }
          }
        }
      },
      {
        $group: {
          _id: '$_id',
          thumbnail: {
            $first: '$thumbnail'
          },
          title: {
            $first: '$title'
          },
          description: {
            $first: '$description'
          },
          content: {
            $first: '$content'
          },
          author: {
            $first: '$author'
          },
          orderNumber: {
            $first: '$orderNumber'
          },
          status: {
            $first: '$status'
          },
          approvalStatus: {
            $first: '$approvalStatus'
          },
          createdAt: {
            $first: '$createdAt'
          },
          updatedAt: {
            $first: '$updatedAt'
          }
        }
      },
      {
        $project: {
          'author.password': 0,
          'author.type': 0,
          'author.gender': 0,
          'author.phoneNumber': 0,
          'author.addresses': 0,
          'author.defaultAddress': 0,
          'author.status': 0,
          'author.verify': 0,
          'author.forgotPasswordToken': 0,
          'author.verifyEmailToken': 0
        }
      }
    ]
  }

  async findMany({ match = {}, query }: { match?: object; query: PaginationReqQuery }) {
    const { page, limit, skip } = paginationConfig(query)
    const aggregate = [
      {
        $match: match
      },
      ...this.aggregatePost(),
      {
        $sort: {
          orderNumber: 1
        }
      },
      {
        $skip: skip
      },
      {
        $limit: limit
      }
    ]
    const [posts, totalRows] = await Promise.all([
      databaseService.posts.aggregate(aggregate).toArray(),
      databaseService.posts.countDocuments(match)
    ])
    return {
      posts,
      page,
      limit,
      totalRows,
      totalPages: Math.ceil(totalRows / limit)
    }
  }
}

const postService = new PostService()
export default postService
