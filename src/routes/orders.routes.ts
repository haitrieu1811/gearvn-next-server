import { Router } from 'express'

import {
  deleteOrderController,
  getAllOrdersController,
  getMyOrdersController,
  getOrderController,
  updateOrderController
} from '~/controllers/orders.controllers'
import { paginationValidator } from '~/middlewares/common.middlewares'
import {
  deleteOrderRoleValidator,
  getOrdersValidator,
  orderAuthorValidator,
  orderIdValidator,
  readAllOrdersRoleValidator,
  updateOrderRoleValidator,
  updateOrderValidator
} from '~/middlewares/orders.middlewares'
import { accessTokenValidator, isVerifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

const ordersRouter = Router()

ordersRouter.get(
  '/me',
  accessTokenValidator,
  isVerifiedUserValidator,
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

ordersRouter.get(
  '/:orderId',
  accessTokenValidator,
  isVerifiedUserValidator,
  orderIdValidator,
  orderAuthorValidator,
  wrapRequestHandler(getOrderController)
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

ordersRouter.delete(
  '/:orderId',
  accessTokenValidator,
  isVerifiedUserValidator,
  deleteOrderRoleValidator,
  orderIdValidator,
  wrapRequestHandler(deleteOrderController)
)

export default ordersRouter
