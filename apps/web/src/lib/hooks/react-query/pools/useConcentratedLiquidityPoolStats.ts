import { getV3Pool, hydrateV3Pool } from '@sushiswap/graph-client/data-api'
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
      if (!chainId || !address) {
        throw new Error('chainId and address are required')
      }

      const rawPool = await getV3Pool({ chainId, address })
      if (rawPool) {
        const data = hydrateV3Pool(rawPool)

        return {
          ...data,
          feeAmount: data.swapFee * 1000000,
          incentives: data.incentives.map((incentive) => {
            return {
              ...incentive,
              reward: new Amount(
                incentive.rewardToken,
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
    enabled: Boolean(enabled && chainId && address),
  })
}
