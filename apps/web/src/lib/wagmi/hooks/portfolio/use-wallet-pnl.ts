import {
  getPortfolioV2PnL,
  isPnLHistoryChainId,
} from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import type { EvmChainId } from 'sushi/evm'
import type { Address } from 'viem'

export const useWalletPnL = (
  address: Address | undefined,
  tokenMap: Map<EvmChainId, `0x${string}`[]>,
) => {
  return useQuery({
    queryKey: ['wallet-pnl', address],
    queryFn: async () => {
      if (!address || tokenMap.size === 0) return new Map()

      const filteredTokenMap = new Map(
        Array.from(tokenMap.entries()).filter(([chainId]) =>
          isPnLHistoryChainId(chainId),
        ),
      )

      const promises = Array.from(filteredTokenMap.entries()).map(
        ([chainId, assets]) =>
          getPortfolioV2PnL({
            address,
            chainId,
            assets: assets,
          }).catch((err) => {
            console.error(`PnL fetch failed for chain ${chainId}`, err)
            return { assets: [] }
          }),
      )

      const results = await Promise.all(promises)

      const map = new Map<
        string,
        { upnl: number; sparkline: { timestamp: number; price: number }[] }
      >()
      for (const res of results) {
        for (const asset of res.assets ?? []) {
          map.set(asset.address, {
            upnl: asset.uPnL ?? 0,
            sparkline:
              asset.sparklineBalanceUSD30d?.map((p) => ({
                timestamp: p.timestamp,
                price: p.balanceUSD,
              })) ?? [],
          })
        }
      }

      return map
    },
    enabled: Boolean(address) && tokenMap.size > 0,
    staleTime: ms('5m'),
  })
}
