import { useMulticallContract } from '@sushiswap/wagmi'
import { useSingleCallResult } from 'lib/state/multicall'

export function useCurrentBlockTimestamp(chainId: number, blockNumber: number | undefined): string | undefined {
  const contract = useMulticallContract(chainId)
  const callState = useSingleCallResult(chainId, blockNumber, contract, 'getCurrentBlockTimestamp')
  return callState.result?.[0]?.toString()
}
