'use client'

import { useContractRead } from 'wagmi'

import { getMulticall3ContractConfig } from '../contracts'

// TODO: Readd direct export, not sure why it's not working
export const useCurrentBlockTimestamp = (
  chainId: number | undefined,
  enabled = true,
) => {
  return useContractRead({
    ...getMulticall3ContractConfig(chainId),
    functionName: 'getCurrentBlockTimestamp',
    enabled,
    watch: true,
  })
}
