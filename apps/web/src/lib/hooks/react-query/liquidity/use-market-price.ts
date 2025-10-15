import { useQuery } from '@tanstack/react-query'
import { Amount, withoutScientificNotation } from 'sushi'
import type { EvmCurrency } from 'sushi/evm'
import { useGasPrice } from 'wagmi'
import { useSlippageTolerance } from '../../useSlippageTolerance'
import { useTradeQuote } from '../trade'

export const useMarketPrice = ({
  token0,
  token1,
  enabled,
}: {
  token0: EvmCurrency | undefined
  token1: EvmCurrency | undefined
  enabled?: boolean
}) => {
  const [slippagePercent] = useSlippageTolerance()
  const { data: gasPrice } = useGasPrice({ chainId: token0?.chainId })

  const trade = useTradeQuote({
    chainId: token0?.chainId ?? 1,
    fromToken: token0,
    toToken: token1,
    amount: token0 ? Amount.fromHuman(token0, '1') : undefined,
    slippagePercentage: slippagePercent.toString({ fixed: 2 }),
    gasPrice,
    recipient: undefined,
    enabled: Boolean(token0 && token1),
    carbonOffset: false,
  })
  return useQuery({
    queryKey: [
      'market-price',
      token0,
      token1,
      trade.data?.amountOut?.toString(),
    ],
    enabled: Boolean(enabled && trade.data?.amountOut),
    queryFn: async () => {
      if (trade.data?.amountOut && token0 && token1) {
        const amountOutHuman = trade.data.amountOut.toString()
        const token0Per1 = Amount.tryFromHuman(
          token0,
          withoutScientificNotation(
            (
              Number.parseFloat('1') / Number.parseFloat(amountOutHuman)
            ).toString(),
          ) ?? '0',
        )?.toSignificant(6)
        return {
          token1Per0: trade.data.amountOut.toSignificant(6),
          token0Per1: token0Per1,
        }
      }
      return { token1Per0: undefined, token0Per1: undefined }
    },
  })
}

export type MarketPriceData = Awaited<ReturnType<typeof useMarketPrice>>['data']
