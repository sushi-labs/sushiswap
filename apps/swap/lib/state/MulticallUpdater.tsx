import { useBlockNumber } from 'wagmi'

import { multicall } from './multicall'
import { useMulticallContract } from './useMulticallContract'

interface Props {
  chainId: number
}

// Wagmi wrapper for redux multicall
export function Updater({ chainId }: Props) {
  const contract = useMulticallContract({ chainId })
  const { data: latestBlockNumber } = useBlockNumber({ chainId })
  return <multicall.Updater chainId={chainId} latestBlockNumber={latestBlockNumber} contract={contract} />
}
