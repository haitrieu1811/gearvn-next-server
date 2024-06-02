import { Router } from 'express'

import { getAllOrdersController, getMyOrdersController } from '~/controllers/orders.controllers'
import { paginationValidator } from '~/middlewares/common.middlewares'
import { getOrdersValidator, readAllOrdersRoleValidator } from '~/middlewares/orders.middlewares'
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

export default ordersRouter
