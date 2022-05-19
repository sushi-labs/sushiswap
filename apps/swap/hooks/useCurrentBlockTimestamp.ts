import { ChainId } from '@sushiswap/chain'
import { useContract } from 'hooks'
import { useSingleCallResult } from 'lib/state/multicall'

export function useCurrentBlockTimestamp(chainId: ChainId, blockNumber: number | undefined): string | undefined {
  const contract = useContract(chainId)
  const callState = useSingleCallResult(chainId, blockNumber, contract, 'getCurrentBlockTimestamp')
  return callState.result?.[0]?.toString()
}
