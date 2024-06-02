import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'

import { ORDERS_MESSAGES } from '~/constants/message'
import { GetOrdersReqQuery } from '~/models/requests/Order.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import orderService from '~/services/orders.services'

export const getMyOrdersController = async (
  req: Request<ParamsDictionary, any, any, GetOrdersReqQuery>,
  res: Response
) => {
  const { userId } = req.decodedAuthorization as TokenPayload
  const { orders, ...pagination } = await orderService.findMany({
    query: req.query,
    match: {
      userId: new ObjectId(userId)
    }
  })
  return res.json({
    message: ORDERS_MESSAGES.GET_MY_ORDERS_SUCCESS,
    data: {
      orders,
      pagination
    }
  })
}
