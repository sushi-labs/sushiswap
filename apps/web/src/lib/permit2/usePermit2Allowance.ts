'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { permit2Abi_allowance } from 'sushi/abi'
import { Amount, type Token } from 'sushi/currency'
import type { Address } from 'viem'
import { useBlockNumber, useReadContract } from 'wagmi'
import { PERMIT2_ADDRESS, type Permit2ChainId } from './config'

interface UsePermit2Allowance {
  token?: Token
  chainId: Permit2ChainId
  owner: Address | undefined
  spender: Address | undefined
  enabled?: boolean
}

export const usePermit2Allowance = ({
  chainId,
  token,
  owner,
  spender,
  enabled = true,
}: UsePermit2Allowance) => {
  const queryClient = useQueryClient()
  const query = useReadContract({
    chainId,
    address: PERMIT2_ADDRESS[chainId],
    abi: permit2Abi_allowance,
    functionName: 'allowance',
    args: [owner as Address, token?.address as Address, spender as Address],
    query: {
      enabled: Boolean(token && owner && spender && enabled && chainId),
      select: ([allowance, expiry]) => {
        if (!token) return undefined

        if (expiry * 1000 <= Date.now()) {
          return Amount.fromRawAmount(token, 0)
        }

        return Amount.fromRawAmount(token, allowance)
      },
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
