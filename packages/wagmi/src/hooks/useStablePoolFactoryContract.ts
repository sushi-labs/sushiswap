import {
  tridentStablePoolFactoryAbi,
  tridentStablePoolFactoryAddress,
  TridentStablePoolFactoryChainId,
} from '@sushiswap/trident-sdk'
import { Address, usePublicClient } from 'wagmi'
import { getContract } from 'wagmi/actions'

export const getStablePoolFactoryContract = (chainId: number | undefined) => ({
  address: (tridentStablePoolFactoryAddress?.[chainId as TridentStablePoolFactoryChainId] ?? '') as Address,
  abi: tridentStablePoolFactoryAbi?.[chainId as TridentStablePoolFactoryChainId] ?? [],
})

export function useStablePoolFactoryContract(chainId: number | undefined) {
  return getContract({
    ...getStablePoolFactoryContract(chainId),
    walletClient: usePublicClient({ chainId }),
  })
}
