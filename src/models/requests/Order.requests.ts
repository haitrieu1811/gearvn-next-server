import { OrderStatus } from '~/constants/enum'
import { PaginationReqQuery } from '~/models/requests/Common.requests'

export type GetOrdersReqQuery = PaginationReqQuery & {
  status?: OrderStatus
}
