import {
  type PoolChainId,
  type PortfolioV2LiquidityPositionOrderBy,
  type PortfolioV2LiquidityPositionOrderDirection,
  type PortfolioV2Protocol,
  getPortfolioV2LiquidityPositions,
} from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import type { Address } from 'viem'
import {
  DEFAULT_LP_CHAIN_IDS,
  DEFAULT_LP_PROTOCOLS,
} from '~evm/[chainId]/portfolio/lp-position-provider'

export const useLiquidityPositions = ({
  address,
  chainIds = DEFAULT_LP_CHAIN_IDS,
  protocols = DEFAULT_LP_PROTOCOLS,
  orderBy = 'UNCOLLECTED_FEES',
  orderDirection = 'desc',
}: {
  address: Address | undefined
  chainIds?: PoolChainId[]
  protocols?: PortfolioV2Protocol[]
  orderBy?: PortfolioV2LiquidityPositionOrderBy
  orderDirection?: PortfolioV2LiquidityPositionOrderDirection
}) => {
  return useQuery({
    queryKey: [
      'portfolio-useLiquidityPositions',
      address,
      chainIds,
      protocols,
      orderBy,
      orderDirection,
    ],
    queryFn: async () => {
      if (!address) {
        throw new Error('Address is required')
      }
      if (!chainIds || chainIds.length === 0) {
        throw new Error('At least one chainId is required')
      }
      if (!protocols || protocols.length === 0) {
        throw new Error('At least one protocol is required')
      }
      return await getPortfolioV2LiquidityPositions({
        user: address,
        chainIds,
        protocols,
        orderBy,
        orderDirection,
      })
    },
    enabled: Boolean(address && chainIds?.length > 0 && protocols?.length > 0),
    staleTime: ms('5m'),
  })
}
