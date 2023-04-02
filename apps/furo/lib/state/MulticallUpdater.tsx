import { useMulticallContract } from '@sushiswap/wagmi'
import { SupportedChainId } from 'config'
import { useBlockNumber } from '@sushiswap/wagmi'

import { multicall } from './multicall'

interface Props {
  chainId: SupportedChainId
  isDebug?: boolean
}

// Wagmi wrapper for redux multicall
export function Updater({ chainId, isDebug = true }: Props) {
  const contract = useMulticallContract(chainId)
  const { data: latestBlockNumber } = useBlockNumber({ chainId })

  return (
    <multicall.Updater chainId={chainId} latestBlockNumber={latestBlockNumber} contract={contract} isDebug={isDebug} />
  )
}
