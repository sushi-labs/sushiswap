import { useMemo } from 'react'
import { TridentChainId } from 'sushi/config'
import { PublicClient, getContract } from 'viem'
import { usePublicClient } from 'wagmi'
import { getTridentConstantPoolFactoryContract } from '../actions/getTridentConstantPoolFactoryContract'

export function useTridentConstantPoolFactoryContract(
  chainId: TridentChainId | null,
) {
  // For performance
  const client = usePublicClient() as PublicClient

  return useMemo(() => {
    if (!chainId) return null

    return getContract({
      ...getTridentConstantPoolFactoryContract(chainId),
      client,
    })
  }, [client, chainId])
}
