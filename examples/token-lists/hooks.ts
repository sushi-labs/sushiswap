import { ChainId } from '@sushiswap/chain'
import { providers } from 'ethers'
import { useMemo } from 'react'

const providerCache: Partial<Record<ChainId, providers.JsonRpcProvider>> = {}

export function useProvider(chainId: ChainId) {
  return useMemo(() => {
    return getProvider(chainId)
  }, [chainId])
}

export function getProvider(chainId: ChainId) {
  if (providerCache[chainId]) return providerCache[chainId]!
  const infuraKey = process.env.NEXT_PUBLIC_INFURA_ID
  if (!infuraKey) throw new Error('NEXT_PUBLIC_INFURA_ID is required for provider')
  const name = getInfuraChainName(chainId)
  providerCache[chainId] = new providers.InfuraProvider(name, infuraKey)
  return providerCache[chainId]!
}

export function getInfuraChainName(chainId: ChainId) {
  switch (chainId) {
    case ChainId.ETHEREUM:
      return 'homestead'
    case ChainId.RINKEBY:
      return 'rinkeby'
    case ChainId.ROPSTEN:
      return 'ropsten'
    case ChainId.GÖRLI:
      return 'goerli'
    case ChainId.KOVAN:
      return 'kovan'
    default:
      throw new Error(`Unsupported eth infura chainId for ${chainId}`)
  }
}
