import { getBuiltGraphSDK, QuerytokensByChainIdsArgs } from '@sushiswap/graph-client'

import { SUPPORTED_CHAIN_IDS } from '../../config'

const sdk = getBuiltGraphSDK()

export type GetTokensQuery = Omit<QuerytokensByChainIdsArgs, 'where' | 'pagination'> & {
  networks: string
  where?: string
  pagination: string
}

export const getTokens = async (query?: GetTokensQuery) => {
  try {
    const first = 20
    const skip = 0
    const where = {
      ...(query?.where && { ...Object.fromEntries(new URLSearchParams(query.where)), liquidityUSD_gt: 100000 }),
    }
    const orderBy = query?.orderBy || 'liquidityUSD'
    const orderDirection = query?.orderDirection || 'desc'
    const chainIds = query?.networks ? JSON.parse(query.networks) : SUPPORTED_CHAIN_IDS
    const { tokens } = await sdk.TokensByChainIds({
      first,
      skip,
      where,
      orderBy,
      orderDirection,
      chainIds,
    })

    return tokens
  } catch (error) {
    console.log(error)
    throw new Error(error)
  }
}
