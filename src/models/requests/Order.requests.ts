import { ParamsDictionary } from 'express-serve-static-core'

import { OrderStatus } from '~/constants/enum'
import { PaginationReqQuery } from '~/models/requests/Common.requests'

export type GetOrdersReqQuery = PaginationReqQuery & {
  status?: OrderStatus
}

export type UpdateOrderReqBody = {
  status: OrderStatus
}

export type OrderIdReqParams = ParamsDictionary & {
  orderId: string
}
