import type { PortfolioV2PositionPoolType } from '@sushiswap/graph-client/data-api-portfolio'
import { useMemo } from 'react'
import {
  type EvmAddress,
  type EvmChainId,
  EvmToken,
  unwrapEvmToken,
} from 'sushi/evm'

export const useTokensFromPosition = ({
  data,
}: { data: PortfolioV2PositionPoolType }) => {
  const [token0, token1] = useMemo(() => {
    return [
      unwrapEvmToken(
        new EvmToken({
          chainId: data.position.token0.chainId as EvmChainId,
          address: data.position.token0.address as EvmAddress,
          decimals: data.position.token0.decimals,
          symbol: data.position.token0.symbol,
          name: data.position.token0.name,
        }),
      ),
      unwrapEvmToken(
        new EvmToken({
          chainId: data.position.token1.chainId as EvmChainId,
          address: data.position.token1.address as EvmAddress,
          decimals: data.position.token1.decimals,
          symbol: data.position.token1.symbol,
          name: data.position.token1.name,
        }),
      ),
    ]
  }, [data])
  return {
    token0,
    token1,
  }
}
