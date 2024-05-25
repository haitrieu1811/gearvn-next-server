import { PaginationReqQuery } from '~/models/requests/Common.requests'

export const numberEnumToArray = (numberEnum: { [key: string]: string | number }) => {
  return Object.values(numberEnum).filter((item) => typeof item === 'number') as number[]
}

export const paginationConfig = (query: PaginationReqQuery) => {
  const { page, limit } = query
  const pageConfig = Number(page) || 1
  const limitConfig = Number(limit) || 20
  const skip = (pageConfig - 1) * limitConfig
  return {
    page: pageConfig,
    limit: limitConfig,
    skip
  }
}
