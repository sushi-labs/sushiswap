import { FURO_SUBGRAPH_NAME } from '@sushiswap/graph-config'

import {
  Pagination,
} from '@sushiswap/graph-client'

import { SUPPORTED_CHAIN_IDS } from '../config'

import { getBuiltGraphSDK, QuerytransactionsArgs } from '.graphclient'

const GRAPH_HOST = 'api.thegraph.com'

export type GetTransactionsQuery = Omit<QuerytransactionsArgs, 'where' | 'pagination'> & {
    networks: string
    where?: string
    pagination: string
  }
  
export const getTransactions = async (query?: GetTransactionsQuery) => {
    
    const pagination: Pagination = query?.pagination ? JSON.parse(query.pagination) : { pageIndex: 0, pageSize: 20 }
    const first = 20;
    const skip = pagination?.pageIndex && pagination?.pageSize ? pagination.pageIndex * pagination.pageSize : 0;
    const where = { ...(query?.where && { ...JSON.parse(query.where) }) }
    const orderBy = query?.orderBy || 'createdAtTimestamp'
    const orderDirection = query?.orderDirection || 'desc'
    const chainId = query?.networks ? query.networks : SUPPORTED_CHAIN_IDS[0]
  
    const sdk = await getBuiltGraphSDK({ chainId, host: GRAPH_HOST, name: FURO_SUBGRAPH_NAME[chainId] })
    const result = (await sdk.analyticsTransactions({ first, skip, where, orderBy, orderDirection })).transactions ?? []
    return result === undefined ? [] : result;
  }
  
  export type GetTransactionCountQuery = Partial<{
    networks: string
  }>
  
  export const getTransactionCount = async (query?: GetTransactionCountQuery) => {
    const chainId = query?.networks ? query.networks : SUPPORTED_CHAIN_IDS[0]
    const sdk = await getBuiltGraphSDK({ chainId, host: GRAPH_HOST, name: FURO_SUBGRAPH_NAME[chainId] })
    const result = ((await sdk.analyticsTransactions({})).transactions ?? []).length;
    return result === undefined ? 0 : result;
  }
  