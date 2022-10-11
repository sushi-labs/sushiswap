import { Amount } from '@sushiswap/currency'
import { STARGATE_CHAIN_ID, STARGATE_POOL_ADDRESS, STARGATE_POOL_ID } from '@sushiswap/stargate'
import STARGATE_FEE_LIBRARY_V03_ABI from '@sushiswap/stargate/abis/stargate-fee-library-v03.json'
import STARGATE_POOL_ABI from '@sushiswap/stargate/abis/stargate-pool.json'
import { useSushiXSwapContractWithProvider } from '@sushiswap/wagmi'
import { useMemo } from 'react'
import { useContractRead, useContractReads } from 'wagmi'

import { useBridgeState } from '../../components'

export const useBridgeFees = () => {
  const { srcChainId, dstChainId, srcToken, dstToken, amount } = useBridgeState()

  const contract = useSushiXSwapContractWithProvider(srcChainId)

  const { data: stargatePoolResults } = useContractReads({
    contracts: [
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
    ],
    enabled: Boolean(srcChainId && dstChainId && srcChainId !== dstChainId),
  })

  const { data: getFeesResults } = useContractRead({
    addressOrName: String(stargatePoolResults?.[1]),
    functionName: 'getFees',
    args: [
      STARGATE_POOL_ID[srcChainId][srcToken.wrapped.address],
      STARGATE_POOL_ID[dstChainId][dstToken.wrapped.address],
      STARGATE_CHAIN_ID[dstChainId],
      contract.address,
      amount?.quotient?.toString(),
    ],
    contractInterface: STARGATE_FEE_LIBRARY_V03_ABI,
    chainId: srcChainId,
    enabled: Boolean(
      amount && contract && srcChainId && dstChainId && srcChainId !== dstChainId && stargatePoolResults
    ),
  })

  return useMemo(() => {
    if (!getFeesResults) {
      return {
        eqFee: undefined,
        eqReward: undefined,
        lpFee: undefined,
        protocolFee: undefined,
        bridgeFee: undefined,
      }
    }

    const eqFee = Amount.fromRawAmount(srcToken.wrapped, getFeesResults.eqFee.toString())
    const eqReward = Amount.fromRawAmount(srcToken.wrapped, getFeesResults.eqReward.toString())
    const lpFee = Amount.fromRawAmount(srcToken.wrapped, getFeesResults.lpFee.toString())
    const protocolFee = Amount.fromRawAmount(srcToken.wrapped, getFeesResults.protocolFee.toString())
    let bridgeFee = undefined

    if (eqFee && eqReward && lpFee && protocolFee) {
      bridgeFee = eqFee.subtract(eqReward).add(lpFee).add(protocolFee)
    }

    return { eqFee, eqReward, lpFee, protocolFee, bridgeFee }
  }, [getFeesResults, srcToken])
}
