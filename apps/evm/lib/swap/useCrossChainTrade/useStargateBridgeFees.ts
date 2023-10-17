import {
  STARGATE_CHAIN_ID,
  STARGATE_ETH_ADDRESS,
  STARGATE_POOL_ADDRESS,
  STARGATE_POOL_ID,
  StargateChainId,
} from '@sushiswap/stargate'
import { ADDRESS_ZERO } from '@sushiswap/v3-sdk'
import { Address, useContractRead, useContractReads } from '@sushiswap/wagmi'
import { useMemo } from 'react'
import { stargateFeeLibraryV03Abi, stargatePoolAbi } from 'sushi/abi'
import { STARGATE_ADAPTER_ADDRESS, StargateAdapterChainId } from 'sushi/config'
import { Amount, Currency } from 'sushi/currency'

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
                    ? STARGATE_ETH_ADDRESS[
                        srcChainId as keyof typeof STARGATE_ETH_ADDRESS
                      ]
                    : srcBridgeToken.address
                ] as Address,
                functionName: 'getChainPath',
                args: [
                  STARGATE_CHAIN_ID[dstChainId as StargateChainId],
                  BigInt(
                    STARGATE_POOL_ID[dstChainId][
                      dstBridgeToken.isNative
                        ? STARGATE_ETH_ADDRESS[
                            dstChainId as keyof typeof STARGATE_ETH_ADDRESS
                          ]
                        : dstBridgeToken.address
                    ] ?? 0,
                  ),
                ],
                abi: stargatePoolAbi,
                chainId: srcChainId,
              },
              {
                address: STARGATE_POOL_ADDRESS[srcChainId][
                  srcBridgeToken.isNative
                    ? STARGATE_ETH_ADDRESS[
                        srcChainId as keyof typeof STARGATE_ETH_ADDRESS
                      ]
                    : srcBridgeToken.address
                ] as Address,
                functionName: 'feeLibrary',
                abi: stargatePoolAbi,
                chainId: srcChainId,
              },
              {
                address: STARGATE_POOL_ADDRESS[srcChainId][
                  srcBridgeToken.isNative
                    ? STARGATE_ETH_ADDRESS[
                        srcChainId as keyof typeof STARGATE_ETH_ADDRESS
                      ]
                    : srcBridgeToken.address
                ] as Address,
                functionName: 'sharedDecimals',
                abi: stargatePoolAbi,
                chainId: srcChainId,
              },
            ] as const),
      [srcChainId, srcBridgeToken, dstChainId, dstBridgeToken],
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
      ? amount.asFraction.divide(10n ** (localDecimals - sharedDecimals))
      : amount.asFraction.multiply(10n ** (sharedDecimals - localDecimals))
  }, [amount, stargatePoolResults])

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
                    ? STARGATE_ETH_ADDRESS[
                        srcChainId as keyof typeof STARGATE_ETH_ADDRESS
                      ]
                    : srcBridgeToken.address
                ] ?? 0,
              ),
              BigInt(
                STARGATE_POOL_ID[dstChainId][
                  dstBridgeToken.isNative
                    ? STARGATE_ETH_ADDRESS[
                        dstChainId as keyof typeof STARGATE_ETH_ADDRESS
                      ]
                    : dstBridgeToken.address
                ] ?? 0,
              ),
              STARGATE_CHAIN_ID[dstChainId as StargateChainId],
              STARGATE_ADAPTER_ADDRESS[srcChainId] as Address,
              BigInt(adjusted?.quotient ?? 0),
            ],
      [srcChainId, srcBridgeToken, dstChainId, dstBridgeToken, adjusted],
    ) as [bigint, bigint, number, `0x${string}`, bigint] | undefined,
    abi: stargateFeeLibraryV03Abi,
    chainId: srcChainId,
    enabled: Boolean(
      enabled &&
        adjusted &&
        srcBridgeToken &&
        dstBridgeToken &&
        stargatePoolResults?.[1]?.result &&
        stargatePoolResults?.[2]?.result,
    ),
    watch: Boolean(
      enabled &&
        adjusted &&
        srcBridgeToken &&
        dstBridgeToken &&
        stargatePoolResults?.[1]?.result &&
        stargatePoolResults?.[2]?.result,
    ),
    select(getFeesResults) {
      if (
        !amount ||
        !getFeesResults ||
        !stargatePoolResults?.[2]?.result ||
        !srcBridgeToken ||
        !dstBridgeToken
      ) {
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
