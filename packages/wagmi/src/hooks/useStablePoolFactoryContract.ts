'use client'

import { usePublicClient } from 'wagmi'
import { getContract } from 'wagmi/actions'
import { getTridentStablePoolFactoryContract } from '../contracts'

export function useStablePoolFactoryContract(chainId: number | undefined) {
  return getContract({
    ...getTridentStablePoolFactoryContract(chainId),
    walletClient: usePublicClient({ chainId }),
  })
}
