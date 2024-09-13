import {
  stargateFeeLibraryV03Abi_getFees,
  stargatePoolAbi_feeLibrary,
  stargatePoolAbi_getChainPath,
  stargatePoolAbi_sharedDecimals,
} from 'sushi/abi'
import {
  STARGATE_ADAPTER_ADDRESS,
  STARGATE_CHAIN_ID,
  STARGATE_ETH_ADDRESS,
  STARGATE_POOL_ADDRESS,
  STARGATE_POOL_ID,
  StargateAdapterChainId,
  StargateChainId,
  publicClientConfig,
} from 'sushi/config'
import { Amount, Type } from 'sushi/currency'
import { Address, createPublicClient, zeroAddress } from 'viem'

interface GetStargateFeesParams {
  amount: bigint
  srcBridgeToken: Type
  dstBridgeToken: Type
}

export const getStargateFees = async ({
  amount: _amount,
  srcBridgeToken,
  dstBridgeToken,
}: GetStargateFeesParams) => {
  if (!_amount) return undefined

  const client = createPublicClient(publicClientConfig[srcBridgeToken.chainId])

  const stargatePoolResults = await getStargatePool({
    srcBridgeToken,
    dstBridgeToken,
  })

  const amount = Amount.fromRawAmount(srcBridgeToken, _amount)

  const adjusted = (() => {
    if (!stargatePoolResults?.[2]?.result) return undefined
    const localDecimals = BigInt(amount.currency.decimals)
    const sharedDecimals = stargatePoolResults[2].result
    if (localDecimals === sharedDecimals) return amount
    return localDecimals > sharedDecimals
      ? amount.asFraction.divide(10n ** (localDecimals - sharedDecimals))
      : amount.asFraction.multiply(10n ** (sharedDecimals - localDecimals))
  })()

  const feesResults = await client.readContract({
    address: stargatePoolResults?.[1]?.result ?? zeroAddress,
    functionName: 'getFees',
    args: [
      BigInt(
        STARGATE_POOL_ID[srcBridgeToken.chainId][
          srcBridgeToken.isNative
            ? STARGATE_ETH_ADDRESS[
                srcBridgeToken.chainId as keyof typeof STARGATE_ETH_ADDRESS
              ]
            : srcBridgeToken.address
        ] ?? 0,
      ),
      BigInt(
        STARGATE_POOL_ID[dstBridgeToken.chainId][
          dstBridgeToken.isNative
            ? STARGATE_ETH_ADDRESS[
                dstBridgeToken.chainId as keyof typeof STARGATE_ETH_ADDRESS
              ]
            : dstBridgeToken.address
        ] ?? 0,
      ),
      STARGATE_CHAIN_ID[dstBridgeToken.chainId as StargateChainId],
      STARGATE_ADAPTER_ADDRESS[
        srcBridgeToken.chainId as StargateAdapterChainId
      ] as Address,
      BigInt(adjusted?.quotient ?? 0),
    ],
    abi: stargateFeeLibraryV03Abi_getFees,
  })

  if (
    !amount ||
    !feesResults ||
    !stargatePoolResults?.[1]?.result ||
    !stargatePoolResults?.[2]?.result ||
    !srcBridgeToken ||
    !dstBridgeToken
  ) {
    return undefined
  }

  const localDecimals = BigInt(amount.currency.decimals)
  const sharedDecimals = stargatePoolResults[2].result

  const { eqFee, eqReward, lpFee, protocolFee } = feesResults

  if (localDecimals === sharedDecimals)
    return [eqFee, eqReward, lpFee, protocolFee]

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

  return [_eqFee, _eqReward, _lpFee, _protocolFee]
}

const getStargatePool = async ({
  srcBridgeToken,
  dstBridgeToken,
}: Omit<GetStargateFeesParams, 'amount'>) => {
  const client = createPublicClient(publicClientConfig[srcBridgeToken.chainId])

  return client.multicall({
    contracts: [
      {
        address: STARGATE_POOL_ADDRESS[srcBridgeToken.chainId][
          srcBridgeToken.isNative
            ? STARGATE_ETH_ADDRESS[
                srcBridgeToken.chainId as keyof typeof STARGATE_ETH_ADDRESS
              ]
            : srcBridgeToken.address
        ] as Address,
        functionName: 'getChainPath',
        args: [
          STARGATE_CHAIN_ID[dstBridgeToken.chainId as StargateChainId],
          BigInt(
            STARGATE_POOL_ID[dstBridgeToken.chainId][
              dstBridgeToken.isNative
                ? STARGATE_ETH_ADDRESS[
                    dstBridgeToken.chainId as keyof typeof STARGATE_ETH_ADDRESS
                  ]
                : dstBridgeToken.address
            ] ?? 0,
          ),
        ],
        abi: stargatePoolAbi_getChainPath,
      },
      {
        address: STARGATE_POOL_ADDRESS[srcBridgeToken.chainId][
          srcBridgeToken.isNative
            ? STARGATE_ETH_ADDRESS[
                srcBridgeToken.chainId as keyof typeof STARGATE_ETH_ADDRESS
              ]
            : srcBridgeToken.address
        ] as Address,
        functionName: 'feeLibrary',
        abi: stargatePoolAbi_feeLibrary,
      },
      {
        address: STARGATE_POOL_ADDRESS[srcBridgeToken.chainId][
          srcBridgeToken.isNative
            ? STARGATE_ETH_ADDRESS[
                srcBridgeToken.chainId as keyof typeof STARGATE_ETH_ADDRESS
              ]
            : srcBridgeToken.address
        ] as Address,
        functionName: 'sharedDecimals',
        abi: stargatePoolAbi_sharedDecimals,
      },
    ] as const,
  })
}
