import { getV3Pool } from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import { Amount } from 'sushi'
import { type EvmAddress, EvmToken, type SushiSwapV3ChainId } from 'sushi/evm'
import { parseUnits } from 'viem'

interface UseConcentratedLiquidityPoolStats {
  chainId: SushiSwapV3ChainId | undefined
  address: EvmAddress | undefined
  enabled?: boolean
}

export const useConcentratedLiquidityPoolStats = ({
  chainId,
  address,
  enabled = true,
}: UseConcentratedLiquidityPoolStats) => {
  return useQuery({
    queryKey: ['useConcentratedLiquidityPoolStats', { address, chainId }],
    queryFn: async () => {
      if (!chainId || !address) return undefined

      const data = await getV3Pool({ chainId, address })
      if (data) {
        return {
          ...data,
          token0: new EvmToken({
            chainId: data.chainId,
            address: data.token0.address,
            decimals: data.token0.decimals,
            name: data.token0.name,
            symbol: data.token0.symbol,
          }),
          token1: new EvmToken({
            chainId: data.chainId,
            address: data.token1.address,
            decimals: data.token1.decimals,
            name: data.token1.name,
            symbol: data.token1.symbol,
          }),
          feeAmount: data.swapFee * 1000000,
          incentives: data.incentives.map((incentive) => {
            const rewardToken = new EvmToken({
              chainId: incentive.chainId,
              address: incentive.rewardToken.address,
              decimals: incentive.rewardToken.decimals,
              name: incentive.rewardToken.name,
              symbol: incentive.rewardToken.symbol,
            })

            return {
              ...incentive,
              reward: new Amount(
                rewardToken,
                parseUnits(
                  incentive.rewardPerDay.toString(),
                  incentive.rewardToken.decimals,
                ),
              ),
            }
          }),
        }
      }

      return null
    },
    refetchInterval: 10000,
    enabled: Boolean(enabled && address),
  })
}
