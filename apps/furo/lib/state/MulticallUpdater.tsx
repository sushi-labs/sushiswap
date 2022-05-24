import { ChainId } from '@sushiswap/chain'

import { useMulticallContract } from '../../hooks/useMulticallContract'
import { multicall } from './multicall'

interface Props {
  chainId: ChainId
  blockNumber: number | undefined
}

export function Updater({ chainId, blockNumber }: Props) {
  const contract = useMulticallContract(chainId)
  return <multicall.Updater chainId={chainId} latestBlockNumber={blockNumber} contract={contract} />
}
