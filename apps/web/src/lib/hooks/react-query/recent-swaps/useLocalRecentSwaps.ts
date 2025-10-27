import { useLocalStorage } from '@tronweb3/tronwallet-adapter-react-hooks'
import { useCallback, useMemo } from 'react'
import type { ChainId } from 'sushi'
import type { EvmAddress, EvmCurrency } from 'sushi/evm'

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

export const filterLocalRecentSwapsByAccountAndChainIds = ({
  account,
  chainIds,
}: { account: EvmAddress; chainIds: ChainId[] }) => {
  return (swaps: LocalRecentSwap[]) => {
    return swaps.filter(
      (swap) =>
        swap.account?.toLowerCase() === account.toLowerCase() &&
        chainIds.some((i) => i === swap.token0.chainId),
    )
  }
}

//@dev hook currently used only to store swaps, will be used in porfolio page chart later
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
