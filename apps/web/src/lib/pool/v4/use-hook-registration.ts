import { useMemo } from 'react'
import { decodeHooksRegistration } from 'src/lib/pool/v4/sdk/utils/decodeHooksRegistration'
import type { Address } from 'sushi'
import { isAddress } from 'viem'
import { useReadContract } from 'wagmi'
import type { SushiSwapV4ChainId } from './config'

const abiShard = [
  {
    type: 'function',
    name: 'getHooksRegistrationBitmap',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint16',
        internalType: 'uint16',
      },
    ],
    stateMutability: 'pure',
  },
] as const

interface UseHookRegistration {
  chainId: SushiSwapV4ChainId
  hook: string
  enabled?: boolean
}

export const useHookRegistration = ({
  chainId,
  hook,
  enabled = true,
}: UseHookRegistration) => {
  const hookRegistationQuery = useReadContract({
    chainId,
    address: hook as Address,
    abi: abiShard,
    functionName: 'getHooksRegistrationBitmap',
    args: [],
    query: {
      staleTime: Number.POSITIVE_INFINITY,
      enabled: Boolean(enabled && isAddress(hook, { strict: false })),
    },
  })

  return useMemo(
    () => ({
      ...hookRegistationQuery,
      data: hookRegistationQuery.data
        ? decodeHooksRegistration(hookRegistationQuery.data)
        : undefined,
    }),
    [hookRegistationQuery],
  )
}
