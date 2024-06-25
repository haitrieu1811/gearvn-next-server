import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'

import { ORDERS_MESSAGES } from '~/constants/message'
import { GetOrdersReqQuery, OrderIdReqParams, UpdateOrderReqBody } from '~/models/requests/Order.requests'
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

export const getAllOrdersController = async (
  req: Request<ParamsDictionary, any, any, GetOrdersReqQuery>,
  res: Response
) => {
  const { orders, ...pagination } = await orderService.findMany({
    query: req.query
  })
  return res.json({
    message: ORDERS_MESSAGES.GET_ALL_ORDERS_SUCCESS,
    data: {
      orders,
      pagination
    }
  })
}

export const getOrderController = async (req: Request<OrderIdReqParams>, res: Response) => {
  const result = await orderService.findById(new ObjectId(req.params.orderId))
  return res.json({
    message: ORDERS_MESSAGES.GET_ORDER_DETAIL_SUCCESS,
    data: result
  })
}

export const updateOrderController = async (req: Request<OrderIdReqParams, any, UpdateOrderReqBody>, res: Response) => {
  const result = await orderService.update({
    data: req.body,
    orderId: new ObjectId(req.params.orderId)
  })
  return res.json({
    message: ORDERS_MESSAGES.UPDATE_ORDER_SUCCESS,
    data: result
  })
}

export const deleteOrderController = async (req: Request<OrderIdReqParams>, res: Response) => {
  await orderService.delete(new ObjectId(req.params.orderId))
  return res.json({
    message: ORDERS_MESSAGES.DELETE_ORDER_SUCCESS
  })
}
