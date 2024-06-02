import isUndefined from 'lodash/isUndefined'
import omitBy from 'lodash/omitBy'

import { ENV_CONFIG } from '~/constants/config'
import { GetOrdersReqQuery } from '~/models/requests/Order.requests'
import databaseService from '~/services/database.services'
import { paginationConfig } from '~/utils/utils'

class OrderService {
  aggregateOrder() {
    return [
      {
        $lookup: {
          from: 'cartItems',
          localField: 'cartItems',
          foreignField: '_id',
          as: 'cartItems'
        }
      },
      {
        $lookup: {
          from: 'provinces',
          localField: 'provinceId',
          foreignField: '_id',
          as: 'province'
        }
      },
      {
        $unwind: {
          path: '$province'
        }
      },
      {
        $addFields: {
          district: {
            $filter: {
              input: '$province.districts',
              as: 'district',
              cond: {
                $eq: ['$districtId', '$$district.id']
              }
            }
          }
        }
      },
      {
        $unwind: {
          path: '$district'
        }
      },
      {
        $addFields: {
          ward: {
            $filter: {
              input: '$district.wards',
              as: 'ward',
              cond: {
                $eq: ['$$ward.id', '$wardId']
              }
            }
          },
          street: {
            $filter: {
              input: '$district.streets',
              as: 'street',
              cond: {
                $eq: ['$$street.id', '$streetId']
              }
            }
          }
        }
      },
      {
        $unwind: {
          path: '$ward'
        }
      },
      {
        $unwind: {
          path: '$street'
        }
      },
      {
        $unwind: {
          path: '$cartItems'
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: 'cartItems.productId',
          foreignField: '_id',
          as: 'cartItemsProduct'
        }
      },
      {
        $unwind: {
          path: '$cartItemsProduct'
        }
      },
      {
        $lookup: {
          from: 'files',
          localField: 'cartItemsProduct.thumbnail',
          foreignField: '_id',
          as: 'cartItemsProductThumbnail'
        }
      },
      {
        $unwind: {
          path: '$cartItemsProductThumbnail'
        }
      },
      {
        $addFields: {
          'cartItemsProduct.thumbnail': {
            $concat: [ENV_CONFIG.HOST, '/', ENV_CONFIG.STATIC_IMAGES_PATH, '/', '$cartItemsProductThumbnail.name']
          }
        }
      },
      {
        $addFields: {
          'cartItems.product': '$cartItemsProduct'
        }
      },
      {
        $group: {
          _id: '$_id',
          fullName: {
            $first: '$fullName'
          },
          phoneNumber: {
            $first: '$phoneNumber'
          },
          totalItems: {
            $first: '$totalItems'
          },
          totalAmount: {
            $first: '$totalAmount'
          },
          totalAmountReduced: {
            $first: '$totalAmountReduced'
          },
          paymentMethod: {
            $first: '$paymentMethod'
          },
          status: {
            $first: '$status'
          },
          cartItems: {
            $push: '$cartItems'
          },
          province: {
            $first: '$province'
          },
          district: {
            $first: '$district'
          },
          ward: {
            $first: '$ward'
          },
          street: {
            $first: '$street'
          },
          detailAddress: {
            $first: '$detailAddress'
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
          'cartItems.userId': 0,
          'cartItems.productId': 0,
          'cartItems.createdAt': 0,
          'cartItems.updatedAt': 0,
          'cartItems.product.userId': 0,
          'cartItems.product.productCategoryId': 0,
          'cartItems.product.brandId': 0,
          'cartItems.product.shortDescription': 0,
          'cartItems.product.description': 0,
          'cartItems.product.photos': 0,
          'cartItems.product.orderNumber': 0,
          'cartItems.product.specifications': 0,
          'cartItems.product.status': 0,
          'cartItems.product.approvalStatus': 0,
          'cartItems.product.createdAt': 0,
          'cartItems.product.updatedAt': 0,
          'province.id': 0,
          'province.districts': 0,
          'district.wards': 0,
          'district.streets': 0,
          'district.projects': 0
        }
      }
    ]
  }

  async findMany({ match = {}, query }: { match?: object; query: GetOrdersReqQuery }) {
    const { page, limit, skip } = paginationConfig(query)
    const { status } = query
    const configuredMatch = omitBy(
      {
        ...match,
        status: status !== undefined ? Number(status) : undefined
      },
      isUndefined
    )
    const aggregate = [
      {
        $match: configuredMatch
      },
      ...this.aggregateOrder(),
      {
        $sort: {
          createdAt: -1
        }
      },
      {
        $skip: skip
      },
      {
        $limit: limit
      }
    ]
    const [orders, totalRows] = await Promise.all([
      databaseService.orders.aggregate(aggregate).toArray(),
      databaseService.orders.countDocuments(match)
    ])
    return {
      orders,
      page,
      limit,
      totalRows,
      totalPages: Math.ceil(totalRows / limit)
    }
  }
}

const orderService = new OrderService()
export default orderService