import { Currency, Native } from '@sushiswap/currency'
import { useQuery } from '@tanstack/react-query'
import {
  STARGATE_CHAIN_PATHS,
  STARGATE_ETH_ADDRESS,
  STARGATE_USDC,
  STARGATE_USDC_ADDRESS,
  STARGATE_USDT,
  STARGATE_USDT_ADDRESS,
  StargateChainId,
} from '@sushiswap/stargate'
import { Address } from 'wagmi'

export const useStargatePath = ({
  srcCurrency,
  dstCurrency,
  enabled,
}: {
  srcCurrency?: Currency
  dstCurrency?: Currency
  enabled: boolean
}) => {
  return useQuery({
    queryKey: ['useStargatePath', srcCurrency, dstCurrency],
    queryFn: () => {
      if (!srcCurrency || !dstCurrency) throw new Error()

      const srcChainPaths = STARGATE_CHAIN_PATHS[srcCurrency.chainId as StargateChainId]

      // If srcCurrency is ETH, check for ETH path
      if (srcCurrency.isNative && srcCurrency.chainId in STARGATE_ETH_ADDRESS) {
        const ethPaths = srcChainPaths[STARGATE_ETH_ADDRESS[srcCurrency.chainId as keyof typeof STARGATE_ETH_ADDRESS]]

        if (ethPaths.find((dstBridgeToken) => dstBridgeToken.chainId === dstCurrency.chainId)) {
          return {
            srcBridgeToken: srcCurrency,
            dstBridgeToken: Native.onChain(dstCurrency.chainId),
          }
        }
      }

      // Else fallback to USDC/USDT
      if (srcCurrency.chainId in STARGATE_USDC_ADDRESS || srcCurrency.chainId in STARGATE_USDT_ADDRESS) {
        const srcBridgeToken =
          srcCurrency.chainId in STARGATE_USDC
            ? STARGATE_USDC[srcCurrency.chainId as keyof typeof STARGATE_USDC]
            : STARGATE_USDT[srcCurrency.chainId as keyof typeof STARGATE_USDT]

        const usdPaths = srcChainPaths[srcBridgeToken.address as Address]

        const dstBridgeToken = usdPaths.find((dstBridgeToken) => dstBridgeToken.chainId === dstCurrency.chainId)

        if (dstBridgeToken) {
          return {
            srcBridgeToken,
            dstBridgeToken,
          }
        }
      }

      // No path found -> throw error
      throw new Error('Stargate ChainPath not found')
    },
    enabled: enabled && Boolean(srcCurrency) && Boolean(dstCurrency),
    refetchInterval: Infinity,
  })
}
