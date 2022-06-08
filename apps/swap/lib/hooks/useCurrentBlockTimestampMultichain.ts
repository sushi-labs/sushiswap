import { Interface } from '@ethersproject/abi'
import { ChainId } from '@sushiswap/chain'
import { MULTICALL_ADDRESS } from '@sushiswap/wagmi'
import UniswapInterfaceMulticallArtifact from '@uniswap/v3-periphery/artifacts/contracts/lens/UniswapInterfaceMulticall.sol/UniswapInterfaceMulticall.json'
import { useMultiChainSingleContractSingleData } from 'lib/state/multicall'
import { useMemo } from 'react'

const MULTICALL_INTERFACE = new Interface(UniswapInterfaceMulticallArtifact.abi)

export function useCurrentBlockTimestampMultichain(
  chainIds: ChainId[],
  blockNumbers: Array<number | undefined>
): Array<string | undefined> {
  const chainToBlock = useMemo(() => {
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
    MULTICALL_INTERFACE,
    'getCurrentBlockTimestamp'
  )

  return Object.values(chainToCallState).map((callState) => callState.result?.[0]?.toString())
}
