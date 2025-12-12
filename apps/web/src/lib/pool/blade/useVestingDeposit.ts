'use client'

import type { BladePool } from '@sushiswap/graph-client/data-api'
import { useCallback } from 'react'
import type { Address } from 'viem'
import { useReadContract } from 'wagmi'
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
  const query = useReadContract({
    chainId,
    address: pool.address,
    abi: bladeCommonExchangeAbi,
    functionName: 'vestingDeposits',
    args: address ? [address] : undefined,
    query: {
      refetchInterval: 10000,
      enabled: Boolean(address && enabled),
      select: useCallback((data: readonly [bigint, bigint]) => {
        const [lockedUntil, poolTokenAmount] = data
        return {
          balance: poolTokenAmount,
          lockedUntil:
            lockedUntil !== 0n
              ? new Date(Number(lockedUntil) * 1000)
              : undefined,
        }
      }, []),
    },
  })

  return query
}
