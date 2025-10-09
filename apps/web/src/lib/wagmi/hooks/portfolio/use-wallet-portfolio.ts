import type { PortfolioV2Token } from '@sushiswap/graph-client/data-api-portfolio'
import { useMemo } from 'react'
import type { EvmChainId } from 'sushi/evm'
import type { Address } from 'viem'
import { useWalletPnL } from './use-wallet-pnl'
import { useWalletPositions } from './use-wallet-positions'

export const useWalletPortfolio = ({
  address,
  chainIds,
}: {
  address: Address | undefined
  chainIds: EvmChainId[]
}) => {
  // 1. Load base wallet positions first (instant render)
  const {
    data: walletData,
    isLoading: positionsLoading,
    isError: positionsError,
  } = useWalletPositions({
    address,
    chainIds,
  })

  const tokens = walletData?.tokens ?? []

  // 2. Build a map: chainId → token addresses[]
  const tokenMap = useMemo(() => {
    const map = new Map<EvmChainId, `0x${string}`[]>()
    for (const t of tokens) {
      const id = t.token.chainId as EvmChainId
      if (!map.has(id)) map.set(id, [])
      map.get(id)!.push(t.token.address as `0x${string}`)
    }
    return map
  }, [tokens])

  // 3. Fetch PnL data concurrently (non-blocking)
  const {
    data: pnlMap,
    isLoading: pnlLoading,
    isError: pnlError,
  } = useWalletPnL(address, tokenMap)

  // 4. Merge PnL data into tokens (progressive hydration)
  const merged = useMemo(() => {
    if (!tokens.length) return []
    return tokens.map((t) => {
      const key = t.token.address
      const pnl = pnlMap?.get(key)
      return {
        ...t,
        uPnL: pnl?.upnl ?? 0,
        last30Days: pnl?.sparkline ?? [],
      }
    })
  }, [tokens, pnlMap])

  return {
    data: {
      tokens: merged,
      totalValueUSD: walletData?.totalValueUSD,
    },
    isLoading: positionsLoading || pnlLoading,
    isError: positionsError || pnlError,
  }
}

export type PortfolioV2Row = PortfolioV2Token & {
  uPnL: number
  last30Days: {
    timestamp: number
    price: number
  }[]
}
