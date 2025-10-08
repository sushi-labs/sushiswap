'use client'

import type { BladePool } from '@sushiswap/graph-client/data-api'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import type { Address } from 'viem'
import { useBlockNumber, useReadContract } from 'wagmi'
import { bladeCommonExchangeAbi } from './abi/bladeCommonExchange'

interface UseVestingDeposit {
  pool: Pick<BladePool, 'address' | 'chainId'>
  address: Address | undefined
  enabled?: boolean
}

export const useVestingDeposit = ({
  pool,
  address,
  enabled = true,
}: UseVestingDeposit) => {
  const { chainId } = pool
  const queryClient = useQueryClient()
  const query = useReadContract({
    chainId,
    address: pool.address,
    abi: bladeCommonExchangeAbi,
    functionName: 'vestingDeposits',
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address && enabled),
      select: (data) => {
        const [lockedUntil, poolTokenAmount] = data
        return {
          balance: poolTokenAmount,
          lockedUntil:
            lockedUntil !== 0n
              ? new Date(Number(lockedUntil) * 1000)
              : undefined,
        }
      },
    },
  })

  const { data: blockNumber } = useBlockNumber({
    chainId,
    watch: true,
  })

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
