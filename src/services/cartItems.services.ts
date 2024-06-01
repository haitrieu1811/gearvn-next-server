import { ObjectId } from 'mongodb'

import CartItem from '~/models/databases/CartItem.database'
import databaseService from '~/services/database.services'

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
}

const cartItemService = new CartItemService()
export default cartItemService
