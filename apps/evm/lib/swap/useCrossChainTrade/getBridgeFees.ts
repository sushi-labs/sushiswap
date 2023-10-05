import { stargateFeeLibraryV03Abi, stargatePoolAbi } from '@sushiswap/abi'
import { Amount, Currency, Token } from '@sushiswap/currency'
import { STARGATE_CHAIN_ID, STARGATE_POOL_ADDRESS, STARGATE_POOL_ID, StargateChainId } from '@sushiswap/stargate'
import { Address, getSushiXSwapContractConfig, readContracts } from '@sushiswap/wagmi'
import { getContract, readContract } from '@sushiswap/wagmi/actions'

export const getBridgeFees = async ({
  amount,
  srcChainId,
  srcBridgeToken,
  dstChainId,
  dstBridgeToken,
}: {
  amount?: Amount<Currency>
  srcChainId: StargateChainId
  srcBridgeToken: Token
  dstChainId: StargateChainId
  dstBridgeToken: Token
}) => {
  if (!amount) return [undefined, undefined, undefined, undefined]

  try {
    const contract = getContract({
      ...getSushiXSwapContractConfig(srcChainId),
    })

    const stargatePoolResults = await readContracts({
      contracts: [
        {
          address: STARGATE_POOL_ADDRESS[srcChainId][srcBridgeToken.address] as Address,
          functionName: 'getChainPath',
          args: [STARGATE_CHAIN_ID[dstChainId], BigInt(STARGATE_POOL_ID[dstChainId][dstBridgeToken.address])],
          abi: stargatePoolAbi,
          chainId: srcChainId,
        },
        {
          address: STARGATE_POOL_ADDRESS[srcChainId][srcBridgeToken.address] as Address,
          functionName: 'feeLibrary',
          abi: stargatePoolAbi,
          chainId: srcChainId,
        },
        {
          address: STARGATE_POOL_ADDRESS[srcChainId][srcBridgeToken.address] as Address,
          functionName: 'sharedDecimals',
          abi: stargatePoolAbi,
          chainId: srcChainId,
        },
      ],
      allowFailure: false,
    })

    const adjusted = (() => {
      const localDecimals = BigInt(amount.currency.decimals)
      const sharedDecimals = stargatePoolResults[2]
      if (localDecimals === sharedDecimals) return amount
      return localDecimals > sharedDecimals
        ? amount.asFraction.divide(10n ** (localDecimals - sharedDecimals))
        : amount.asFraction.multiply(10n ** (sharedDecimals - localDecimals))
    })()

    const getFeesResults = await readContract({
      address: stargatePoolResults?.[1] as Address,
      functionName: 'getFees',
      args: [
        BigInt(STARGATE_POOL_ID[srcChainId][srcBridgeToken.address]),
        BigInt(STARGATE_POOL_ID[dstChainId][dstBridgeToken.address]),
        STARGATE_CHAIN_ID[dstChainId],
        contract.address as Address,
        adjusted.quotient,
      ],
      abi: stargateFeeLibraryV03Abi,
      chainId: srcChainId,
    })

    if (!amount || !getFeesResults || !stargatePoolResults?.[2]) {
      return [undefined, undefined, undefined, undefined]
    }

    const localDecimals = BigInt(amount.currency.decimals)
    const sharedDecimals = stargatePoolResults[2]

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
  } catch {
    return [undefined, undefined, undefined, undefined]
  }
}
