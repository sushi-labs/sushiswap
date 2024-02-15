import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { useSlippageTolerance } from '@sushiswap/hooks'
import { useQuery } from '@tanstack/react-query'
import { useSwapState } from 'app/swap/trade/TradeProvider'
import { usePools } from 'utils/usePools'
import { getAllCommonPairs } from 'utils/utilFunctions'
import { useNetwork } from './useNetwork'
import { useTokenBalance } from './useTokenBalance'

export function useSwapRouter() {
  const { amount, token0, token1 } = useSwapState()
  const { account, connected } = useWallet()
  const { network } = useNetwork()
  const [slippageTolerance] = useSlippageTolerance()
  const { data: pairs } = usePools(true)

  const { data: balance } = useTokenBalance({
    account: account?.address as string,
    currency: token0?.address,
    refetchInterval: 2000,
  })

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
        balance,
        network,
      },
    ],
    queryFn: async () =>
      getAllCommonPairs({
        amountIn: parseFloat(
          (Number(amount) * 10 ** token0.decimals) as unknown as string,
        ),
        coinA: token0,
        coinB: token1,
        pairs,
        network,
      }),
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
    refetchIntervalInBackground: true,
    enabled: Boolean(
      amount && Number(amount) > 0 && typeof balance !== 'undefined',
    ),
  })
}
