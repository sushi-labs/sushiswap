import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import type { SushiSwapV3ChainId, SushiSwapV3FeeAmount } from 'sushi/evm'
import type { Address } from 'viem'
import { useConfig } from 'wagmi'
import { getConcentratedLiquidityPositions } from '../actions/getConcentratedLiquidityPositions'

interface UseConcentratedLiquidityPositionParams {
  account: Address | undefined
  chainId: SushiSwapV3ChainId
  feeAmount: SushiSwapV3FeeAmount | undefined
  poolAddress: Address | undefined
  enabled?: boolean
}

export const useConcentratedLiquidityPosition = ({
  account,
  chainId,
  feeAmount,
  poolAddress,
  enabled = true,
}: UseConcentratedLiquidityPositionParams) => {
  const config = useConfig()

  return useQuery({
    queryKey: ['useConcentratedLiquidityPosition', { chainId, account }],
    queryFn: async () => {
      const positions = await getConcentratedLiquidityPositions({
        account,
        chainIds: [chainId],
        config,
      })

      if (!positions?.length) return null

      const position = positions?.find((position) => {
        return position.fee === feeAmount && position.address === poolAddress
      })

      return position ?? null
    },
    refetchInterval: ms('10m'),
    enabled: Boolean(account && chainId && feeAmount && poolAddress && enabled),
  })
}
