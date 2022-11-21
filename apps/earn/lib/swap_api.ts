import { SUSHISWAP_SUBGRAPH_NAME } from '@sushiswap/graph-config'

import {
	Pagination,
} from '@sushiswap/graph-client'

import { getBuiltGraphSDK, QueryswapsArgs } from '.graphclient'

const GRAPH_HOST = 'api.thegraph.com'

export type GetSwapsQuery = Omit<QueryswapsArgs, 'where' | 'pagination'> & {
	chainId: string
	pagination: string
	pairId: string
}

export const getSwaps = async (query?: GetSwapsQuery) => {
	if (!query?.chainId || !query?.pairId) {
		throw Error('Invalid pair id or chain id')
	}
	const pagination: Pagination = query?.pagination ? JSON.parse(query.pagination) : { pageIndex: 0, pageSize: 20 }
	const first = 20
	const skip = pagination?.pageIndex && pagination?.pageSize ? pagination.pageIndex * pagination.pageSize : 0;
  const orderBy = query?.orderBy || 'timestamp'
	const orderDirection = query?.orderDirection || 'desc'
	const chainId = query?.chainId
	const pairId = query?.pairId
	const where = {
		pair_: {
			id: pairId,
		}
	}
	const sdk = await getBuiltGraphSDK({ chainId, host: GRAPH_HOST, name: SUSHISWAP_SUBGRAPH_NAME[chainId]})
	const result = (await sdk.swapsArray({ first, skip, where, orderBy, orderDirection })).swaps
	return result === undefined ? [] : result;
}

export type GetSwapsCountQuery = Partial<{
  chainId: string
	pairId: string
}>

export const getSwapsCount = async (query: GetSwapsCountQuery) => {
	if (!query.chainId || !query.pairId) {
		throw Error('Invalid pair id or chain id')
	}
	const chainId = query.chainId
	const pairId = query.pairId
	const where = {
		pair_ : {
			id: pairId,
		}
	}
	const sdk = await getBuiltGraphSDK({ chainId, host: GRAPH_HOST, name: SUSHISWAP_SUBGRAPH_NAME[chainId]})
	const result = ((await sdk.swapsArray({where})).swaps ?? []).length
	return result === undefined ? 0 : result;
}

