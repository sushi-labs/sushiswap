import { Amount, Currency, Token } from '@sushiswap/currency'
import { STARGATE_CHAIN_ID, STARGATE_POOL_ADDRESS, STARGATE_POOL_ID } from '@sushiswap/stargate'
import { useSushiXSwapContractWithProvider } from '@sushiswap/wagmi'
import STARGATE_FEE_LIBRARY_V03_ABI from 'abis/stargate-fee-library-v03.json'
import STARGATE_POOL_ABI from 'abis/stargate-pool.json'
import { useMemo } from 'react'
import { useContractRead, useContractReads } from 'wagmi'

export const useBridgeFees = ({
  amount,
  srcChainId,
  srcBridgeToken,
  dstChainId,
  dstBridgeToken,
}: {
  amount?: Amount<Currency>
  srcChainId: number
  srcBridgeToken: Token
  dstChainId: number
  dstBridgeToken: Token
}) => {
  const contract = useSushiXSwapContractWithProvider(srcChainId)

  const { data: stargatePoolResults } = useContractReads({
    contracts: [
      {
        addressOrName: STARGATE_POOL_ADDRESS[srcChainId][srcBridgeToken.address],
        functionName: 'getChainPath',
        args: [STARGATE_CHAIN_ID[dstChainId], STARGATE_POOL_ID[dstChainId][dstBridgeToken.address]],
        contractInterface: STARGATE_POOL_ABI,
        chainId: srcChainId,
      },
      {
        addressOrName: STARGATE_POOL_ADDRESS[srcChainId][srcBridgeToken.address],
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
      STARGATE_POOL_ID[srcChainId][srcBridgeToken.address],
      STARGATE_POOL_ID[dstChainId][dstBridgeToken.address],
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
      return [undefined, undefined, undefined, undefined]
    }
    return [
      Amount.fromRawAmount(srcBridgeToken, getFeesResults.eqFee.toString()),
      Amount.fromRawAmount(srcBridgeToken, getFeesResults.eqReward.toString()),
      Amount.fromRawAmount(srcBridgeToken, getFeesResults.lpFee.toString()),
      Amount.fromRawAmount(srcBridgeToken, getFeesResults.protocolFee.toString()),
    ]
  }, [getFeesResults, srcBridgeToken])
}
