import type {
  PoolChainId,
  PortfolioV2Token,
} from '@sushiswap/graph-client/data-api-portfolio'
import { useMemo } from 'react'
import { useWalletFilters } from 'src/app/(networks)/(evm)/[chainId]/portfolio/wallet-filters-provider'
import type { EvmChainId } from 'sushi/evm'
import type { Address } from 'viem'
import { useWalletPnL } from './use-wallet-pnl'
import { useWalletPositions } from './use-wallet-positions'

export const poolChainIds: PoolChainId[] = [
  42161, 42170, 43114, 8453, 288, 56288, 56, 42220, 1, 250, 100, 11235, 137,
  534352, 2222, 1088, 199, 314, 7000, 1116, 108, 10, 59144, 81457, 2046399126,
  30, 146, 43111, 747474, 11155111, 129399, 1101, 5000,
]

const groupByAsset = (tokens: PortfolioV2Row[]) => {
  const map = new Map<string, PortfolioV2Row[]>()

  for (const token of tokens) {
    const canonical =
      token.bridges?.find((b) => b.chainId === 1)?.address ??
      token.token.address

    if (!map.has(canonical)) map.set(canonical, [])
    map.get(canonical)!.push(token)
  }

  return Array.from(map.values()).map((group) => {
    const first = group[0]
    const totalUSD = group.reduce((a, t) => a + (t.amountUSD ?? 0), 0)
    const totalAmount = group.reduce((a, t) => a + Number(t.amount ?? 0), 0)
    const totaluPnL = group.reduce((a, t) => a + (t.uPnL ?? 0), 0)
    const totalPercentageOfPortfolio = group.reduce(
      (a, t) => a + (t.percentageOfPortfolio ?? 0),
      0,
    )

    return {
      ...first,
      amount: totalAmount.toString(),
      amountUSD: totalUSD,
      percentageOfPortfolio: totalPercentageOfPortfolio,
      uPnL: totaluPnL,
      chainIds: group.map((t) => t.token.chainId as EvmChainId),
    }
  })
}

export const useWalletPortfolio = ({
  address,
}: { address: Address | undefined }) => {
  const {
    networks: filteredChainIds,
    groupByAssets,
    hideSmallPositions,
  } = useWalletFilters()

  const {
    data: walletData,
    isLoading: positionsLoading,
    isError: positionsError,
  } = useWalletPositions({
    address,
    chainIds: filteredChainIds as PoolChainId[],
  })

  const tokens = walletData?.tokens ?? []

  const tokenMap = useMemo(() => {
    const map = new Map<EvmChainId, `0x${string}`[]>()
    for (const t of tokens) {
      const id = t.token.chainId as EvmChainId
      if (!map.has(id)) map.set(id, [])
      map.get(id)!.push(t.token.address as `0x${string}`)
    }
    return map
  }, [tokens])

  const {
    data: pnlMap,
    isLoading: pnlLoading,
    isError: pnlError,
  } = useWalletPnL(address, tokenMap)

  const merged = useMemo(() => {
    if (!tokens.length) return []

    const enriched = tokens
      .map((t) => {
        const key = t.token.address
        const pnl = pnlMap?.get(key)
        return {
          ...t,
          uPnL: pnl?.upnl ?? 0,
          last30Days: pnl?.sparkline ?? [],
          chainIds: [t.token.chainId as EvmChainId],
        }
      })
      .filter((t) => (t.amountUSD ?? 0) >= (hideSmallPositions ? 1 : 0))

    return groupByAssets ? groupByAsset(enriched) : enriched
  }, [tokens, pnlMap, groupByAssets, hideSmallPositions])

  const totalPercentageOfPortfolio = useMemo(() => {
    return merged.reduce((acc, t) => acc + (t.percentageOfPortfolio ?? 0), 0)
  }, [merged])

  return {
    data: {
      tokens: merged,
      totalValueUSD: walletData?.totalValueUSD,
      totalPercentageOfPortfolio,
    },
    isLoadingPositions: positionsLoading,
    isLoadingPnl: pnlLoading,
    isError: positionsError || pnlError,
  }
}

export type PortfolioV2TokenWithChains = PortfolioV2Token & {
  chainIds: EvmChainId[]
}
export type PortfolioV2Row = PortfolioV2TokenWithChains & {
  uPnL: number
  last30Days: {
    timestamp: number
    price: number
  }[]
}
