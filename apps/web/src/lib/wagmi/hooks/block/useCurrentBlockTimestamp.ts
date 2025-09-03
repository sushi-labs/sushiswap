'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { multicall3Abi_getCurrentBlockTimestamp } from 'sushi/evm'
import { useBlockNumber, useReadContract } from 'wagmi'
import {
  MULTICALL_3_ADDRESS,
  type Multicall3ChainId,
} from '../contracts/multicall3'

// TODO: Readd direct export, not sure why it's not working
export const useCurrentBlockTimestamp = (
  chainId: Multicall3ChainId,
  enabled = true,
) => {
  const queryClient = useQueryClient()
  const query = useReadContract({
    address: MULTICALL_3_ADDRESS[chainId],
    abi: multicall3Abi_getCurrentBlockTimestamp,
    functionName: 'getCurrentBlockTimestamp',
    query: {
      enabled,
    },
  })

  const { data: blockNumber } = useBlockNumber({ chainId, watch: true })

  useEffect(() => {
    if (blockNumber) {
      queryClient.invalidateQueries(
        { queryKey: query.queryKey },
        { cancelRefetch: false },
      )
    }
  }, [blockNumber, queryClient, query.queryKey])

  return query
}
