import { Amount, Token } from '@sushiswap/currency'
import { STARGATE_CHAIN_ID, STARGATE_POOL_ADDRESS, STARGATE_POOL_ID } from '@sushiswap/stargate'
import STARGATE_FEE_LIBRARY_V03_ABI from '@sushiswap/stargate/abis/stargate-fee-library-v03.json'
import STARGATE_POOL_ABI from '@sushiswap/stargate/abis/stargate-pool.json'
import { getSushiXSwapContractConfig } from '@sushiswap/wagmi'
import { isAddress } from 'ethers/lib/utils'
import { useMemo } from 'react'
import { useContractRead, useContractReads } from 'wagmi'

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
    if (srcToken && dstToken) {
      return [
        {
          addressOrName: STARGATE_POOL_ADDRESS[srcChainId][srcToken.wrapped.address],
          functionName: 'getChainPath',
          args: [STARGATE_CHAIN_ID[dstChainId], STARGATE_POOL_ID[dstChainId][dstToken.wrapped.address]],
          contractInterface: STARGATE_POOL_ABI,
          chainId: srcChainId,
        },
        {
          addressOrName: STARGATE_POOL_ADDRESS[srcChainId][srcToken.wrapped.address],
          functionName: 'feeLibrary',
          contractInterface: STARGATE_POOL_ABI,
          chainId: srcChainId,
        },
      ]
    }

    return []
  }, [dstChainId, dstToken, srcChainId, srcToken])

  const { data: stargatePoolResults, isLoading } = useContractReads({
    contracts,
    enabled: !!srcChainId && !!dstChainId && srcChainId !== dstChainId && contracts.length > 0,
  })

  const { data: getFeesResults, isLoading: isFeeResultLoading } = useContractRead({
    addressOrName: String(stargatePoolResults?.[1]),
    functionName: 'getFees',
    args: [
      srcToken ? STARGATE_POOL_ID[srcChainId][srcToken.wrapped.address] : undefined,
      dstToken ? STARGATE_POOL_ID[dstChainId][dstToken.wrapped.address] : undefined,
      STARGATE_CHAIN_ID[dstChainId],
      getSushiXSwapContractConfig(srcChainId).addressOrName,
      amount?.quotient?.toString(),
    ],
    contractInterface: STARGATE_FEE_LIBRARY_V03_ABI,
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

    return { eqFee, eqReward, lpFee, protocolFee, bridgeFee, isLoading: isLoading || isFeeResultLoading }
  }, [getFeesResults, isFeeResultLoading, isLoading, srcToken])
}
