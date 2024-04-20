import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { useSlippageTolerance } from '@sushiswap/hooks'
import { useQuery } from '@tanstack/react-query'
import { useSimpleSwapState } from 'ui/swap/simple/simple-swap-provider/simple-swap-provider'
import { usePools } from 'utils/hooks/usePools'
import { getSwapRoute } from 'utils/swap-get-route'
import { useNetwork } from './useNetwork'

export function useSwapRouter() {
  const { amount, token0, token1 } = useSimpleSwapState()
  const { account, connected } = useWallet()
  const { network } = useNetwork()
  const [slippageTolerance] = useSlippageTolerance()
  const { data: pools } = usePools()

  return useQuery({
    queryKey: [
      'router',
      {
        amount,
        token0,
        token1,
        account,
        connected,
        slippageTolerance,
        network,
      },
    ],
    queryFn: async () => {
      if (!pools) {
        throw new Error('No pairs found')
      }

      return getSwapRoute({
        amountIn: Number(amount) * 10 ** token0.decimals,
        tokenIn: token0,
        tokenOut: token1,
        pools,
        network,
      })
    },
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
    staleTime: 60000,
    enabled: Boolean(amount && Number(amount) > 0 && pools),
  })
}
