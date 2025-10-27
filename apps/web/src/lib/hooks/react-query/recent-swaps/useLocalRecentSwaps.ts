import { useLocalStorage } from '@tronweb3/tronwallet-adapter-react-hooks'
import { useCallback, useMemo } from 'react'
import type { ChainId } from 'sushi'
import {
  type EvmAddress,
  type EvmCurrency,
  EvmNative,
  EvmToken,
} from 'sushi/evm'

export type LocalRecentSwap = {
  token0: EvmCurrency
  token1: EvmCurrency
  amount0: string
  amount1: string
  amount0USD: string | null
  amount1USD: string | null
  tx_hash: `0x${string}`
  timestamp: number
  account: EvmAddress | undefined
  type: 'swap' | 'xswap'
}

export const filterLocalRecentSwapsByAccountAndToken = ({
  account,
  token,
  swaps,
}: {
  swaps: LocalRecentSwap[]
  account: EvmAddress
  token: EvmCurrency | undefined
}) => {
  return swaps.filter((swap) => {
    const token0 = swap.token0.isNative
      ? EvmNative.fromChainId(swap.token0.chainId)
      : new EvmToken({
          chainId: swap.token0.chainId,
          address: swap.token0.address,
          decimals: (swap.token0 as EvmToken).decimals,
          symbol: (swap.token0 as EvmToken).symbol,
          name: (swap.token0 as EvmToken).name,
        })

    const token1 = swap.token1.isNative
      ? EvmNative.fromChainId(swap.token1.chainId)
      : new EvmToken({
          chainId: swap.token1.chainId,
          address: swap.token1.address,
          decimals: (swap.token1 as EvmToken).decimals,
          symbol: (swap.token1 as EvmToken).symbol,
          name: (swap.token1 as EvmToken).name,
        })
    return (
      swap.account?.toLowerCase() === account.toLowerCase() &&
      (token?.isSame(token0) || token?.isSame(token1))
    )
  })
}
export const filterLocalRecentSwapsByAccountAndChainIds = ({
  account,
  chainIds,
  swaps,
}: { swaps: LocalRecentSwap[]; account: EvmAddress; chainIds: ChainId[] }) => {
  return swaps.filter(
    (swap) =>
      swap.account?.toLowerCase() === account.toLowerCase() &&
      chainIds.some((i) => i === swap.token0.chainId),
  )
}

export const useLocalRecentSwaps = () => {
  const [localRecentSwaps, setLocalRecentSwaps] = useLocalStorage(
    'sushi.local-recent-swaps',
    [] as LocalRecentSwap[],
  )

  const storeRecentSwap = useCallback(
    (data: LocalRecentSwap) => {
      setLocalRecentSwaps((value) => {
        const newValue = [data, ...value]
        return newValue
      })
    },
    [setLocalRecentSwaps],
  )

  return useMemo(() => {
    return {
      data: localRecentSwaps,
      storeRecentSwap,
    }
  }, [storeRecentSwap, localRecentSwaps])
}
