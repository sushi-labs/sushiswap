import { abi as MulticallABI } from '@uniswap/v3-periphery/artifacts/contracts/lens/UniswapInterfaceMulticall.sol/UniswapInterfaceMulticall.json'
import { BigNumber, Contract, providers, utils } from 'ethers'
import { useEffect, useMemo, useState } from 'react'
import { UniswapInterfaceMulticall } from './abi/types'
import { ChainId, MULTICALL_ADDRESS, NULL_ADDRESS, USDC_ADDRESS, USDT_ADDRESS } from './constants'
import ERC20_ABI from './erc20.json'
import { useMultiChainSingleContractSingleData, useMultipleContractSingleData, useSingleCallResult } from './multicall'

const providerCache: Partial<Record<ChainId, providers.JsonRpcProvider>> = {}
const MulticallInterface = new utils.Interface(MulticallABI)
const ERC20Interface = new utils.Interface(ERC20_ABI)

export function useContract(chainId: ChainId): UniswapInterfaceMulticall {
  return useMemo(() => {
    return new Contract(MULTICALL_ADDRESS, MulticallABI, getProvider(chainId)) as UniswapInterfaceMulticall
  }, [])
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

export function useMaxTokenBalance(chainId: ChainId, blockNumber: number | undefined): string | undefined {
  const { contracts, accounts } = useMemo(
    () => ({ contracts: [USDC_ADDRESS, USDT_ADDRESS], accounts: [NULL_ADDRESS] }),
    [],
  )
  const results = useMultipleContractSingleData(chainId, blockNumber, contracts, ERC20Interface, 'balanceOf', accounts)
  let max
  for (const result of results) {
    if (!result.valid || !result.result?.length) continue
    const value = BigNumber.from(result.result[0])
    if (!max || value.gt(max)) max = value
  }
  return max?.toString()
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
    case ChainId.MAINNET:
      return 'homestead'
    case ChainId.RINKEBY:
      return 'rinkeby'
    case ChainId.ROPSTEN:
      return 'ropsten'
    case ChainId.GOERLI:
      return 'goerli'
    case ChainId.KOVAN:
      return 'kovan'
    default:
      throw new Error(`Unsupported eth infura chainId for ${chainId}`)
  }
}
