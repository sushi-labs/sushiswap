import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { useSlippageTolerance } from '@sushiswap/hooks'
import { useQuery } from '@tanstack/react-query'
import { useSwapState } from 'app/swap/trade/TradeProvider'
import { Token } from 'utils/tokenType'
import { usePools } from 'utils/usePools'
import { useAllCommonPairs } from 'utils/utilFunctions'

type useSwapRouterArgs = {
  network: string
  balance: number | undefined
}

export function useSwapRouter({ network, balance }: useSwapRouterArgs) {
  const { amount, token0, token1 } = useSwapState()
  const { account, connected } = useWallet()
  const [slippageTolerance] = useSlippageTolerance()
  const { data: pairs } = usePools(network === 'testnet' ? 2 : 1, true)
  return useQuery({
    queryKey: ['router', { amount, token0, token1, account, connected, network, slippageTolerance, balance }],
    queryFn: async () =>
      useAllCommonPairs(parseFloat((Number(amount) * 10 ** 8) as unknown as string), token0, token1, network, pairs),
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
    refetchIntervalInBackground: true,
    enabled: Boolean(amount && Number(amount) > 0),
  })
}
