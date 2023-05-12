import { stargateFeeLibraryV03Abi, stargatePoolAbi } from '@sushiswap/abi'
import { Amount, Currency, Token } from '@sushiswap/currency'
import { JSBI } from '@sushiswap/math'
import { StargateChainId, STARGATE_CHAIN_ID, STARGATE_POOL_ADDRESS, STARGATE_POOL_ID } from '@sushiswap/stargate'
import { getSushiXSwapContractConfig } from '@sushiswap/wagmi'
import { BigNumber } from 'ethers'
import { Address, readContracts } from '@sushiswap/wagmi'
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
  const contract = getContract({
    ...getSushiXSwapContractConfig(srcChainId),
  })

  const stargatePoolResults = await readContracts({
    contracts: [
      {
        address: STARGATE_POOL_ADDRESS[srcChainId][srcBridgeToken.address] as Address,
        functionName: 'getChainPath',
        args: [STARGATE_CHAIN_ID[dstChainId], BigNumber.from(STARGATE_POOL_ID[dstChainId][dstBridgeToken.address])],
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
  })

  const adjusted = (() => {
    if (!amount || !stargatePoolResults?.[2]) return
    const localDecimals = amount.currency.decimals
    const sharedDecimals = stargatePoolResults[2].toNumber()
    if (localDecimals === sharedDecimals) return amount
    return localDecimals > sharedDecimals
      ? amount.asFraction.divide(JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(localDecimals - sharedDecimals)))
      : amount.asFraction.multiply(JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(sharedDecimals - localDecimals)))
  })()

  const getFeesResults = await readContract({
    address: stargatePoolResults?.[1] as Address,
    functionName: 'getFees',
    args: [
      BigNumber.from(STARGATE_POOL_ID[srcChainId][srcBridgeToken.address]),
      BigNumber.from(STARGATE_POOL_ID[dstChainId][dstBridgeToken.address]),
      STARGATE_CHAIN_ID[dstChainId],
      contract.address as Address,
      BigNumber.from(adjusted?.quotient?.toString()),
    ],
    abi: stargateFeeLibraryV03Abi,
    chainId: srcChainId,
  })

  if (!amount || !getFeesResults || !stargatePoolResults?.[2]) {
    return [undefined, undefined, undefined, undefined]
  }

  const localDecimals = amount.currency.decimals
  const sharedDecimals = stargatePoolResults[2].toNumber()

  const eqFee = JSBI.BigInt(getFeesResults.eqFee.toString())
  const eqReward = JSBI.BigInt(getFeesResults.eqReward.toString())
  const lpFee = JSBI.BigInt(getFeesResults.lpFee.toString())
  const protocolFee = JSBI.BigInt(getFeesResults.protocolFee.toString())

  if (localDecimals === sharedDecimals)
    return [
      Amount.fromRawAmount(srcBridgeToken, eqFee),
      Amount.fromRawAmount(srcBridgeToken, eqReward),
      Amount.fromRawAmount(srcBridgeToken, lpFee),
      Amount.fromRawAmount(srcBridgeToken, protocolFee),
    ]

  const _eqFee =
    localDecimals > sharedDecimals
      ? JSBI.multiply(eqFee, JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(localDecimals - sharedDecimals)))
      : JSBI.divide(eqFee, JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(sharedDecimals - localDecimals)))

  const _eqReward =
    localDecimals > sharedDecimals
      ? JSBI.multiply(eqReward, JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(localDecimals - sharedDecimals)))
      : JSBI.divide(eqReward, JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(sharedDecimals - localDecimals)))

  const _lpFee =
    localDecimals > sharedDecimals
      ? JSBI.multiply(lpFee, JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(localDecimals - sharedDecimals)))
      : JSBI.divide(lpFee, JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(sharedDecimals - localDecimals)))

  const _protocolFee =
    localDecimals > sharedDecimals
      ? JSBI.multiply(protocolFee, JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(localDecimals - sharedDecimals)))
      : JSBI.divide(protocolFee, JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(sharedDecimals - localDecimals)))

  return [
    Amount.fromRawAmount(srcBridgeToken, _eqFee),
    Amount.fromRawAmount(srcBridgeToken, _eqReward),
    Amount.fromRawAmount(srcBridgeToken, _lpFee),
    Amount.fromRawAmount(srcBridgeToken, _protocolFee),
  ]
}
