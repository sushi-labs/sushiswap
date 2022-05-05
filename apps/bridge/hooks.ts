import { abi as MulticallABI } from '@uniswap/v3-periphery/artifacts/contracts/lens/UniswapInterfaceMulticall.sol/UniswapInterfaceMulticall'
import { Contract, providers, utils } from 'ethers'
import { useEffect, useMemo, useState } from 'react'
import { UniswapInterfaceMulticall } from './typechain'
import { ChainId } from '@sushiswap/chain'
import { MULTICALL_ADDRESS } from 'config'
import { useMultiChainSingleContractSingleData, useSingleCallResult } from './multicall'

const providerCache: Partial<Record<ChainId, providers.JsonRpcProvider>> = {}
const MulticallInterface = new utils.Interface(MulticallABI)

export function useContract(chainId: ChainId) {
  return useMemo(() => {
    return new Contract(MULTICALL_ADDRESS[chainId], MulticallABI, getProvider(chainId)) as UniswapInterfaceMulticall
  }, [chainId]) as UniswapInterfaceMulticall
}

export function useLatestBlock(provider: providers.JsonRpcProvider) {
  const [blockNumber, setBlockNumber] = useState<number | undefined>(undefined)
  useEffect(() => {
    if (!provider) return
    const onBlock = (num: number) => setBlockNumber(num)
    provider.on('block', onBlock)
    return () => {
      provider.off('block', onBlock)
    }
  }, [provider, setBlockNumber])
  return blockNumber
}

export function useCurrentBlockTimestamp(chainId: ChainId, blockNumber: number | undefined): string | undefined {
  const contract = useContract(chainId)
  const callState = useSingleCallResult(chainId, blockNumber, contract, 'getCurrentBlockTimestamp')
  return callState.result?.[0]?.toString()
}

export function useCurrentBlockTimestampMultichain(
  chainIds: ChainId[],
  blockNumbers: Array<number | undefined>,
): Array<string | undefined> {
  const chainToBlock = useMemo(() => {
    console.log({ blockNumbers })
    return chainIds.reduce((result, chainId, i) => {
      result[chainId] = blockNumbers[i]
      return result
    }, {} as Record<number, number | undefined>)
  }, [chainIds, blockNumbers])

  const chainToAddress = useMemo(() => {
    return chainIds.reduce((result, chainId) => {
      result[chainId] = MULTICALL_ADDRESS[chainId]
      return result
    }, {} as Record<number, string>)
  }, [chainIds])

  const chainToCallState = useMultiChainSingleContractSingleData(
    chainToBlock,
    chainToAddress,
    MulticallInterface,
    'getCurrentBlockTimestamp',
  )

  return Object.values(chainToCallState).map((callState) => callState.result?.[0]?.toString())
}

const ALCHEMY_ENABLED_CHAINS = [ChainId.ETHEREUM, ChainId.POLYGON, ChainId.ARBITRUM, ChainId.OPTIMISM, ChainId.GÖRLI]

const INFURA_ENABLED_CHAINS = [
  ChainId.ETHEREUM,
  ChainId.POLYGON,
  ChainId.ARBITRUM,
  ChainId.OPTIMISM,
  ChainId.ROPSTEN,
  ChainId.RINKEBY,
  ChainId.KOVAN,
]

const ANKR_ENABLED_CHAINS = [ChainId.ETHEREUM, ChainId.POLYGON, ChainId.ARBITRUM, ChainId.OPTIMISM]

const ALCHEMY_API_KEY: Record<number, string> = {
  [ChainId.ETHEREUM]: 'q1pMGalg0HNBvK1eaZoo-vng-EPWlt1t',
  [ChainId.ARBITRUM]: 'eO_ha0kuIlFWSqXokR6-K5LzGx4qB9XV',
  [ChainId.OPTIMISM]: 'rtbMqQGp96fbuXxzUS2fct34eYzA7tY8',
  [ChainId.POLYGON]: 'vZft72lBzQ100fCIJTyohJR1tWrMsUei',
  [ChainId.GÖRLI]: 'BXrZLhuc63Gn91NoLVVFDJ010M-AwOa2',
}

export function getProvider(chainId: ChainId) {
  if (providerCache[chainId]) return providerCache[chainId]!
  const infuraKey = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID
  if (!infuraKey) throw new Error('NEXT_PUBLIC_INFURA_PROJECT_ID is required for provider')

  // const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_ID
  // if (!alchemyKey) throw new Error('NEXT_PUBLIC_ALCHEMY_ID is required for provider')

  // const ankrKey = process.env.NEXT_PUBLIC_ANKR_ID
  // if (!ankrKey) throw new Error('NEXT_PUBLIC_ANKR_ID is required for provider')

  if (ALCHEMY_ENABLED_CHAINS.includes(chainId)) {
    // console.log('ALCHEMY', chainId, ALCHEMY_ENABLED_CHAINS, getAlchemyChainName(chainId))
    const name = getAlchemyChainName(chainId)
    providerCache[chainId] = new providers.AlchemyProvider(name, ALCHEMY_API_KEY[chainId])
  } else if (INFURA_ENABLED_CHAINS.includes(chainId)) {
    // console.log('INFURA', chainId, INFURA_ENABLED_CHAINS, getInfuraChainName(chainId))
    const name = getInfuraChainName(chainId)
    providerCache[chainId] = new providers.InfuraProvider(name, infuraKey)
  } else if (ANKR_ENABLED_CHAINS.includes(chainId)) {
    // const name = getAnkrChainName(chainId)
    // providerCache[chainId] = new providers.AnkrProvider(name, ankrKey)
  }

  return providerCache[chainId]!
}

export function getProviders(chainIds: ChainId[]) {
  return chainIds.map(getProvider)
}

export function getAlchemyChainName(chainId: ChainId) {
  switch (chainId) {
    case ChainId.ETHEREUM:
      return 'homestead'
    case ChainId.POLYGON:
      return 'matic'
    case ChainId.ARBITRUM:
      return 'arbitrum'
    case ChainId.OPTIMISM:
      return 'optimism'
    case ChainId.GÖRLI:
      return 'goerli'
    default:
      throw new Error(`Unsupported eth alchemy chainId for ${chainId}`)
  }
}

export function getInfuraChainName(chainId: ChainId) {
  switch (chainId) {
    case ChainId.ETHEREUM:
      return 'homestead'
    case ChainId.POLYGON:
      return 'matic'
    case ChainId.ARBITRUM:
      return 'arbitrum'
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
