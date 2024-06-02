import { Router } from 'express'

import { getAllOrdersController, getMyOrdersController, updateOrderController } from '~/controllers/orders.controllers'
import { paginationValidator } from '~/middlewares/common.middlewares'
import {
  getOrdersValidator,
  orderIdValidator,
  readAllOrdersRoleValidator,
  updateOrderRoleValidator,
  updateOrderValidator
} from '~/middlewares/orders.middlewares'
import { accessTokenValidator, isCustomerValidator, isVerifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

const ordersRouter = Router()

ordersRouter.get(
  '/me',
  accessTokenValidator,
  isVerifiedUserValidator,
  isCustomerValidator,
  getOrdersValidator,
  paginationValidator,
  wrapRequestHandler(getMyOrdersController)
)

ordersRouter.get(
  '/all',
  accessTokenValidator,
  isVerifiedUserValidator,
  readAllOrdersRoleValidator,
  getOrdersValidator,
  paginationValidator,
  wrapRequestHandler(getAllOrdersController)
)

ordersRouter.patch(
  '/:orderId',
  accessTokenValidator,
  isVerifiedUserValidator,
  updateOrderRoleValidator,
  orderIdValidator,
  updateOrderValidator,
  wrapRequestHandler(updateOrderController)
)

export default ordersRouter
