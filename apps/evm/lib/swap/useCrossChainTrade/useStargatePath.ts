import { Currency, Native, Token } from '@sushiswap/currency'
import { useQuery } from '@tanstack/react-query'
import {
  STARGATE_BRIDGE_TOKENS,
  STARGATE_CHAIN_PATHS,
  STARGATE_ETH_ADDRESS,
  StargateChainId,
  isStargateBridgeToken,
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
    queryFn: async () => {
      if (!srcCurrency || !dstCurrency) throw new Error()

      const srcChainPaths = STARGATE_CHAIN_PATHS[srcCurrency.chainId as StargateChainId] as Record<Address, Token[]>

      // Check if we can bridge srcCurrency without swapping
      if (isStargateBridgeToken(srcCurrency)) {
        const paths = srcChainPaths[
          (srcCurrency.isNative && srcCurrency.chainId in STARGATE_ETH_ADDRESS
            ? STARGATE_ETH_ADDRESS[srcCurrency.chainId as keyof typeof STARGATE_ETH_ADDRESS]
            : srcCurrency.wrapped.address) as keyof typeof srcChainPaths
        ] as Token[]

        const dstBridgeToken = paths.find((token) => token.chainId === dstCurrency.chainId)

        // if dstBridgeToken is found, use srcCurrency as input
        if (dstBridgeToken) {
          return {
            srcBridgeToken: srcCurrency,
            dstBridgeToken: paths.find((dstToken) => dstToken.equals(dstCurrency))
              ? (dstCurrency as Token)
              : dstBridgeToken,
          }
        }
      }

      // srcCurrency cannot be bridged, so we find some other token that can be
      const srcBridgeToken = STARGATE_BRIDGE_TOKENS[srcCurrency.chainId].find((srcToken) =>
        (srcChainPaths[srcToken.address as keyof typeof srcChainPaths] as Token[]).find(
          (dstToken) => dstToken.chainId === dstCurrency.chainId
        )
      )

      if (!srcBridgeToken) throw new Error('Stargate ChainPath not found')

      return {
        srcBridgeToken: srcBridgeToken.wrapped, // use wrapped to avoid RpSentNativeIn error in XSwap
        dstBridgeToken: (srcChainPaths[srcBridgeToken.address as keyof typeof srcChainPaths] as Token[]).find(
          (dstToken) => dstToken.equals(dstCurrency)
        )
          ? (dstCurrency as Token)
          : ((srcChainPaths[srcBridgeToken.address as keyof typeof srcChainPaths] as Token[]).find(
              (dstToken) => dstToken.chainId === dstCurrency.chainId
            ) as Token),
      }
    },
    enabled: enabled && Boolean(srcCurrency) && Boolean(dstCurrency),
    refetchInterval: Infinity,
    select: ({ srcBridgeToken, dstBridgeToken }) => ({
      srcBridgeToken,
      dstBridgeToken:
        dstBridgeToken.chainId in STARGATE_ETH_ADDRESS &&
        dstBridgeToken.address === STARGATE_ETH_ADDRESS[dstBridgeToken.chainId as keyof typeof STARGATE_ETH_ADDRESS]
          ? Native.onChain(dstBridgeToken?.chainId)
          : dstBridgeToken,
    }),
  })
}
