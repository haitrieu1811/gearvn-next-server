import { Request, Response } from 'express'
import { ObjectId, WithId } from 'mongodb'

import { CART_ITEMS_MESSAGES } from '~/constants/message'
import Product from '~/models/databases/Product.database'
import { AddProductToCartReqBody } from '~/models/requests/CartItem.requests'
import { ProductIdReqParams } from '~/models/requests/Product.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import cartItemService from '~/services/cartItems.services'

export const addProductToCartController = async (
  req: Request<ProductIdReqParams, any, AddProductToCartReqBody>,
  res: Response
) => {
  const { userId } = req.decodedAuthorization as TokenPayload
  const product = req.product as WithId<Product>
  const result = await cartItemService.addProductToCart({
    quantity: req.body.quantity,
    unitPrice: product.priceAfterDiscount,
    productId: new ObjectId(req.params.productId),
    userId: new ObjectId(userId)
  })
  return res.json({
    message: CART_ITEMS_MESSAGES.ADD_PRODUCT_TO_CART_SUCCESS,
    data: result
  })
}
