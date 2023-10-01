import { stargateFeeLibraryV03Abi, stargatePoolAbi } from '@sushiswap/abi'
import { Amount, Currency } from '@sushiswap/currency'
import { STARGATE_CHAIN_ID, STARGATE_ETH_ADDRESS, STARGATE_POOL_ADDRESS, STARGATE_POOL_ID } from '@sushiswap/stargate'
import { useMemo } from 'react'
import { Address, useContractRead, useContractReads } from '@sushiswap/wagmi'
import { ADDRESS_ZERO } from '@sushiswap/v3-sdk'
import { STARGATE_ADAPTER_ADDRESS, StargateAdapterChainId } from '@sushiswap/sushixswap-sdk'

export const useStargateBridgeFees = ({
  amount,
  srcChainId,
  srcBridgeToken,
  dstChainId,
  dstBridgeToken,
  enabled = false,
}: {
  amount?: Amount<Currency>
  srcChainId: StargateAdapterChainId
  srcBridgeToken?: Currency
  dstChainId: StargateAdapterChainId
  dstBridgeToken?: Currency
  enabled: boolean
}) => {
  const { data: stargatePoolResults } = useContractReads({
    contracts: useMemo(
      () =>
        !srcBridgeToken || !dstBridgeToken
          ? undefined
          : ([
              {
                address: STARGATE_POOL_ADDRESS[srcChainId][
                  srcBridgeToken.isNative
                    ? STARGATE_ETH_ADDRESS[srcChainId as keyof typeof STARGATE_ETH_ADDRESS]
                    : srcBridgeToken.address
                ] as Address,
                functionName: 'getChainPath',
                args: [
                  STARGATE_CHAIN_ID[dstChainId],
                  BigInt(
                    STARGATE_POOL_ID[dstChainId][
                      dstBridgeToken.isNative
                        ? STARGATE_ETH_ADDRESS[dstChainId as keyof typeof STARGATE_ETH_ADDRESS]
                        : dstBridgeToken.address
                    ] ?? 0
                  ),
                ],
                abi: stargatePoolAbi,
                chainId: srcChainId,
              },
              {
                address: STARGATE_POOL_ADDRESS[srcChainId][
                  srcBridgeToken.isNative
                    ? STARGATE_ETH_ADDRESS[srcChainId as keyof typeof STARGATE_ETH_ADDRESS]
                    : srcBridgeToken.address
                ] as Address,
                functionName: 'feeLibrary',
                abi: stargatePoolAbi,
                chainId: srcChainId,
              },
              {
                address: STARGATE_POOL_ADDRESS[srcChainId][
                  srcBridgeToken.isNative
                    ? STARGATE_ETH_ADDRESS[srcChainId as keyof typeof STARGATE_ETH_ADDRESS]
                    : srcBridgeToken.address
                ] as Address,
                functionName: 'sharedDecimals',
                abi: stargatePoolAbi,
                chainId: srcChainId,
              },
            ] as const),
      [srcChainId, srcBridgeToken, dstBridgeToken]
    ),
    enabled: Boolean(enabled && srcBridgeToken && dstBridgeToken),
    watch: Boolean(enabled && srcBridgeToken && dstBridgeToken),
  })

  const adjusted = useMemo(() => {
    if (!amount || !stargatePoolResults?.[2]?.result) return undefined
    const localDecimals = BigInt(amount.currency.decimals)
    const sharedDecimals = stargatePoolResults[2].result
    if (localDecimals === sharedDecimals) return amount
    return localDecimals > sharedDecimals
      ? amount.asFraction.divide(10n ** localDecimals - sharedDecimals)
      : amount.asFraction.multiply(10n ** (sharedDecimals - localDecimals))
  }, [amount, stargatePoolResults?.[2]?.result])

  return useContractRead({
    address: stargatePoolResults?.[1]?.result ?? ADDRESS_ZERO,
    functionName: 'getFees',
    args: useMemo(
      () =>
        !srcBridgeToken || !dstBridgeToken
          ? undefined
          : [
              BigInt(
                STARGATE_POOL_ID[srcChainId][
                  srcBridgeToken.isNative
                    ? STARGATE_ETH_ADDRESS[srcChainId as keyof typeof STARGATE_ETH_ADDRESS]
                    : srcBridgeToken.address
                ] ?? 0
              ),
              BigInt(
                STARGATE_POOL_ID[dstChainId][
                  dstBridgeToken.isNative
                    ? STARGATE_ETH_ADDRESS[dstChainId as keyof typeof STARGATE_ETH_ADDRESS]
                    : dstBridgeToken.address
                ] ?? 0
              ),
              STARGATE_CHAIN_ID[dstChainId],
              STARGATE_ADAPTER_ADDRESS[srcChainId] as Address,
              BigInt(adjusted?.quotient?.toString() ?? 0),
            ],
      [srcBridgeToken, dstBridgeToken, adjusted]
    ) as [bigint, bigint, number, `0x${string}`, bigint] | undefined,
    abi: stargateFeeLibraryV03Abi,
    chainId: srcChainId,
    enabled: Boolean(
      enabled &&
        adjusted &&
        srcBridgeToken &&
        dstBridgeToken &&
        stargatePoolResults?.[1]?.result &&
        stargatePoolResults?.[2]?.result
    ),
    watch: Boolean(
      enabled &&
        adjusted &&
        srcBridgeToken &&
        dstBridgeToken &&
        stargatePoolResults?.[1]?.result &&
        stargatePoolResults?.[2]?.result
    ),
    select(getFeesResults) {
      if (!amount || !getFeesResults || !stargatePoolResults?.[2]?.result || !srcBridgeToken || !dstBridgeToken) {
        return undefined
      }

      const localDecimals = BigInt(amount.currency.decimals)
      const sharedDecimals = stargatePoolResults[2].result

      const { eqFee, eqReward, lpFee, protocolFee } = getFeesResults

      if (localDecimals === sharedDecimals)
        return [
          Amount.fromRawAmount(srcBridgeToken, eqFee),
          Amount.fromRawAmount(srcBridgeToken, eqReward),
          Amount.fromRawAmount(srcBridgeToken, lpFee),
          Amount.fromRawAmount(srcBridgeToken, protocolFee),
        ]

      const _eqFee =
        localDecimals > sharedDecimals
          ? eqFee * 10n ** (localDecimals - sharedDecimals)
          : eqFee / 10n ** (sharedDecimals - localDecimals)

      const _eqReward =
        localDecimals > sharedDecimals
          ? eqReward * 10n ** (localDecimals - sharedDecimals)
          : eqReward / 10n ** (sharedDecimals - localDecimals)

      const _lpFee =
        localDecimals > sharedDecimals
          ? lpFee * 10n ** (localDecimals - sharedDecimals)
          : lpFee / 10n ** (sharedDecimals - localDecimals)

      const _protocolFee =
        localDecimals > sharedDecimals
          ? protocolFee * 10n ** (localDecimals - sharedDecimals)
          : protocolFee / 10n ** (sharedDecimals - localDecimals)

      return [
        Amount.fromRawAmount(srcBridgeToken, _eqFee),
        Amount.fromRawAmount(srcBridgeToken, _eqReward),
        Amount.fromRawAmount(srcBridgeToken, _lpFee),
        Amount.fromRawAmount(srcBridgeToken, _protocolFee),
      ]
    },
  })
}
