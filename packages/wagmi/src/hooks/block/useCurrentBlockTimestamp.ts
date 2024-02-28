'use client'

import { useEffect } from 'react'
import { useBlockNumber, useReadContract } from 'wagmi'
import { Multicall3ChainId, getMulticall3ContractConfig } from '../contracts'

// TODO: Readd direct export, not sure why it's not working
export const useCurrentBlockTimestamp = (
  chainId: Multicall3ChainId,
  enabled = true,
) => {
  const query = useReadContract({
    ...getMulticall3ContractConfig(chainId),
    functionName: 'getCurrentBlockTimestamp',
    query: {
      enabled,
    },
  })

  const { data: blockNumber } = useBlockNumber({ watch: true })

  useEffect(() => {
    if (blockNumber) {
      query.refetch()
    }
  }, [blockNumber, query.refetch])

  return query
}
