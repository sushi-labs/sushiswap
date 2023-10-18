'use client'

import { getTridentStablePoolFactoryContract } from '../contracts'
import { usePublicClient } from 'wagmi'
import { getContract } from 'wagmi/actions'

export function useStablePoolFactoryContract(chainId: number | undefined) {
  return getContract({
    ...getTridentStablePoolFactoryContract(chainId),
    walletClient: usePublicClient({ chainId }),
  })
}
