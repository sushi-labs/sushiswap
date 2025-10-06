'use client'

import type { EvmToken } from 'sushi/evm'
import { type Address, parseAbi } from 'viem'
import { useReadContract } from 'wagmi'

interface UseTokenAllowance {
  token: EvmToken | undefined
  enabled?: boolean
}

export const useKinesisWrappedToken = ({
  token,
  enabled = true,
}: UseTokenAllowance) => {
  return useReadContract({
    chainId: token?.chainId,
    address: token ? (token.address as Address) : undefined,
    abi: parseAbi(['function wrappedToken() view returns (address)']),
    functionName: 'wrappedToken',
    args: [],
    query: {
      enabled: Boolean(token && enabled),
    },
  })
}
