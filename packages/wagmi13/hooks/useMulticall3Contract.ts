import { otherChains } from '@sushiswap/wagmi-config'
import { Address, Chain, useContract, useProvider } from 'wagmi'
import {
  arbitrum,
  arbitrumGoerli,
  avalanche,
  avalancheFuji,
  bsc,
  bscTestnet,
  fantom,
  fantomTestnet,
  foundry,
  goerli,
  hardhat,
  localhost,
  mainnet,
  optimism,
  optimismGoerli,
  polygon,
  polygonMumbai,
  sepolia,
} from 'wagmi/chains'

import { multicall3Abi } from '../abis'

const chains: Chain[] = [
  arbitrum,
  arbitrumGoerli,
  avalanche,
  avalancheFuji,
  bsc,
  bscTestnet,
  fantom,
  fantomTestnet,
  foundry,
  goerli,
  hardhat,
  localhost,
  mainnet,
  optimism,
  optimismGoerli,
  polygon,
  polygonMumbai,
  sepolia,
  ...otherChains,
]

type Multicall3ChainId = typeof chains[number]['id']

export const getMulticall3ContractConfig = (chainId: Multicall3ChainId | undefined) => ({
  address: (chains.find((chain) => chain?.id === chainId)?.contracts?.multicall3?.address || '') as Address,
  abi: multicall3Abi,
})

export function useMulticall3Contract(chainId: Multicall3ChainId): ReturnType<typeof useContract> {
  return useContract({
    ...getMulticall3ContractConfig(chainId),
    signerOrProvider: useProvider({ chainId }),
  })
}
