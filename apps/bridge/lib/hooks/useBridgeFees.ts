import { stargateFeeLibraryV03Abi, stargatePoolAbi } from '@sushiswap/abi'
import { Amount, Token, Type } from '@sushiswap/currency'
import { STARGATE_CHAIN_ID, STARGATE_POOL_ADDRESS, STARGATE_POOL_ID } from '@sushiswap/stargate'
import { getSushiXSwapContractConfig } from '@sushiswap/wagmi'

import { BigNumber } from '@ethersproject/bignumber'
import { isAddress } from '@ethersproject/address'
import { useMemo } from 'react'
import { Address, useContractRead, useContractReads } from 'wagmi'

import { BridgeState } from '../../components'

export const useBridgeFees = ({
  srcChainId,
  dstChainId,
  srcToken,
  dstToken,
  amount,
}: BridgeState): {
  eqFee: Amount<Token> | undefined
  eqReward: Amount<Token> | undefined
  lpFee: Amount<Token> | undefined
  protocolFee: Amount<Token> | undefined
  bridgeFee: Amount<Token> | undefined
  isLoading: boolean
} => {
  const contracts = useMemo(() => {
    if (!srcToken || !dstToken) return []
    return [
      {
        address: STARGATE_POOL_ADDRESS[srcChainId][srcToken.wrapped.address],
        functionName: 'getChainPath',
        args: [STARGATE_CHAIN_ID[dstChainId], STARGATE_POOL_ID[dstChainId][dstToken.wrapped.address]],
        abi: stargatePoolAbi,
        chainId: srcChainId,
      },
      {
        address: STARGATE_POOL_ADDRESS[srcChainId][srcToken.wrapped.address],
        functionName: 'feeLibrary',
        abi: stargatePoolAbi,
        chainId: srcChainId,
      },
    ]
  }, [dstChainId, dstToken, srcChainId, srcToken])

  const { data: stargatePoolResults, isLoading } = useContractReads({
    contracts,
    enabled: !!srcChainId && !!dstChainId && srcChainId !== dstChainId && contracts.length > 0,
  })

  const { data: getFeesResults, isLoading: isFeeResultLoading } = useContractRead({
    address: String(stargatePoolResults?.[1]),
    functionName: 'getFees',
    args: amount
      ? [
          BigNumber.from(STARGATE_POOL_ID[srcChainId][(srcToken as Type).wrapped.address]),
          BigNumber.from(STARGATE_POOL_ID[dstChainId][(dstToken as Type).wrapped.address]),
          STARGATE_CHAIN_ID[dstChainId],
          getSushiXSwapContractConfig(srcChainId).address as Address,
          BigNumber.from(amount?.quotient?.toString()),
        ]
      : undefined,
    abi: stargateFeeLibraryV03Abi,
    chainId: srcChainId,
    enabled: Boolean(
      !isLoading &&
        isAddress(String(stargatePoolResults?.[1])) &&
        Array.isArray(stargatePoolResults) &&
        stargatePoolResults.length > 0 &&
        !!amount &&
        !!srcChainId &&
        !!dstChainId &&
        srcChainId !== dstChainId &&
        !!srcToken &&
        !!dstToken
    ),
  })

  return useMemo(() => {
    if (!getFeesResults || !srcToken) {
      return {
        eqFee: undefined,
        eqReward: undefined,
        lpFee: undefined,
        protocolFee: undefined,
        bridgeFee: undefined,
        isLoading: isLoading || isFeeResultLoading,
      }
    }

    const eqFee = Amount.fromRawAmount(srcToken.wrapped, getFeesResults.eqFee.toString())
    const eqReward = Amount.fromRawAmount(srcToken.wrapped, getFeesResults.eqReward.toString())
    const lpFee = Amount.fromRawAmount(srcToken.wrapped, getFeesResults.lpFee.toString())
    const protocolFee = Amount.fromRawAmount(srcToken.wrapped, getFeesResults.protocolFee.toString())

    let bridgeFee: Amount<Token> | undefined = undefined
    if (eqFee && eqReward && lpFee && protocolFee) {
      bridgeFee = eqFee.subtract(eqReward).add(lpFee).add(protocolFee)
    }

    return {
      eqFee,
      eqReward,
      lpFee,
      protocolFee,
      bridgeFee,
      isLoading: isLoading || isFeeResultLoading,
    }
  }, [getFeesResults, isFeeResultLoading, isLoading, srcToken])
}
