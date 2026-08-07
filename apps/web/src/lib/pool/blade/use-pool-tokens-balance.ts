'use client'

import type { BladePool } from '@sushiswap/graph-client/data-api'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useBlockNumber, useReadContract } from 'wagmi'
import { bladeCommonExchangeAbi } from './abi/bladeCommonExchange'

interface UsePoolTokensBalance {
  pool: Pick<BladePool, 'address' | 'chainId'>
  enabled?: boolean
}

export const usePoolTokensBalance = ({
  pool,
  enabled = true,
}: UsePoolTokensBalance) => {
  const { chainId } = pool
  const query = useReadContract({
    chainId,
    address: pool.address,
    abi: bladeCommonExchangeAbi,
    functionName: 'allTokensBalance',
    args: [],
    query: {
      enabled,
      refetchInterval: 10000,
    },
  })

  return query
}
