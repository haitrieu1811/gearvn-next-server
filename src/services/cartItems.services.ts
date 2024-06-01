import { ObjectId } from 'mongodb'

import { ENV_CONFIG } from '~/constants/config'
import { CartItemStatus } from '~/constants/enum'
import CartItem, { AggregateCartItem } from '~/models/databases/CartItem.database'
import { PaginationReqQuery } from '~/models/requests/Common.requests'
import databaseService from '~/services/database.services'
import { paginationConfig } from '~/utils/utils'

class CartItemService {
  async addProductToCart({
    productId,
    userId,
    unitPrice,
    quantity
  }: {
    userId: ObjectId
    productId: ObjectId
    unitPrice: number
    quantity: number
  }) {
    let cartItem = await databaseService.cartItems.findOne({
      userId,
      productId
    })
    if (!cartItem) {
      const { insertedId } = await databaseService.cartItems.insertOne(
        new CartItem({
          unitPrice,
          quantity,
          userId,
          productId
        })
      )
      cartItem = await databaseService.cartItems.findOne({ _id: insertedId })
    } else {
      cartItem = await databaseService.cartItems.findOneAndUpdate(
        {
          userId,
          productId
        },
        {
          $inc: {
            quantity
          },
          $set: {
            unitPrice
          },
          $currentDate: {
            updatedAt: true
          }
        },
        {
          returnDocument: 'after'
        }
      )
    }
    return {
      cartItem
    }
  }

  async updateQuantity({ cartItemId, quantity }: { quantity: number; cartItemId: ObjectId }) {
    const updatedCartItem = await databaseService.cartItems.findOneAndUpdate(
      {
        _id: cartItemId
      },
      {
        $set: {
          quantity
        },
        $currentDate: {
          updatedAt: true
        }
      },
      {
        returnDocument: 'after'
      }
    )
    return {
      cartItem: updatedCartItem
    }
  }

  async delete(cartItemId: ObjectId) {
    await databaseService.cartItems.deleteOne({ _id: cartItemId })
    return true
  }

  async getMyCart({ userId, query }: { userId: ObjectId; query: PaginationReqQuery }) {
    const { page, limit, skip } = paginationConfig(query)
    const match = {
      userId,
      status: CartItemStatus.InCart
    }
    const [cartItems, totalRows] = await Promise.all([
      databaseService.cartItems
        .aggregate<AggregateCartItem>([
          {
            $match: match
          },
          {
            $lookup: {
              from: 'products',
              localField: 'productId',
              foreignField: '_id',
              as: 'product'
            }
          },
          {
            $unwind: {
              path: '$product'
            }
          },
          {
            $lookup: {
              from: 'files',
              localField: 'product.thumbnail',
              foreignField: '_id',
              as: 'productThumbnail'
            }
          },
          {
            $unwind: {
              path: '$productThumbnail'
            }
          },
          {
            $addFields: {
              'product.thumbnail': {
                $concat: [ENV_CONFIG.HOST, '/', ENV_CONFIG.STATIC_IMAGES_PATH, '/', '$productThumbnail.name']
              }
            }
          },
          {
            $group: {
              _id: '$_id',
              product: {
                $first: '$product'
              },
              unitPrice: {
                $first: '$unitPrice'
              },
              quantity: {
                $first: '$quantity'
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
              'product.userId': 0,
              'product.productCategoryId': 0,
              'product.brandId': 0,
              'product.shortDescription': 0,
              'product.description': 0,
              'product.photos': 0,
              'product.specifications': 0,
              'product.orderNumber': 0,
              'product.status': 0,
              'product.approvalStatus': 0
            }
          },
          {
            $sort: {
              updatedAt: -1
            }
          },
          {
            $skip: skip
          },
          {
            $limit: limit
          }
        ])
        .toArray(),
      databaseService.cartItems.countDocuments(match)
    ])
    const totalItems = cartItems.reduce((acc, cartItem) => acc + cartItem.quantity, 0)
    const totalAmount = cartItems.reduce((acc, cartItem) => acc + cartItem.unitPrice * cartItem.quantity, 0)
    return {
      totalItems,
      totalAmount,
      cartItems,
      page,
      limit,
      totalRows,
      totalPages: Math.ceil(totalRows / limit)
    }
  }
}

const cartItemService = new CartItemService()
export default cartItemService
