import { abi as MulticallABI } from '@uniswap/v3-periphery/artifacts/contracts/lens/UniswapInterfaceMulticall.sol/UniswapInterfaceMulticall.json'
import { Contract, providers, utils } from 'ethers'
import { useEffect, useMemo, useState } from 'react'
import { UniswapInterfaceMulticall } from './typechain'
import { ChainId, MULTICALL_ADDRESS } from './constants'
import { useMultiChainSingleContractSingleData, useSingleCallResult } from './multicall'

const providerCache: Partial<Record<ChainId, providers.JsonRpcProvider>> = {}
const MulticallInterface = new utils.Interface(MulticallABI)

export function useContract(chainId: ChainId) {
  return useMemo(() => {
    return new Contract(MULTICALL_ADDRESS, MulticallABI, getProvider(chainId)) as UniswapInterfaceMulticall
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
      result[chainId] = MULTICALL_ADDRESS
      return result
    }, {} as Record<number, string>)
  }, [])

  const chainToCallState = useMultiChainSingleContractSingleData(
    chainToBlock,
    chainToAddress,
    MulticallInterface,
    'getCurrentBlockTimestamp',
  )

  return Object.values(chainToCallState).map((callState) => callState.result?.[0]?.toString())
}

export function getProvider(chainId: ChainId) {
  if (providerCache[chainId]) return providerCache[chainId]!
  const infuraKey = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID
  if (!infuraKey) throw new Error('NEXT_PUBLIC_INFURA_PROJECT_ID is required for provider')
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
