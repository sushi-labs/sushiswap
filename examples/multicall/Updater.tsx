import React from 'react'

import { ChainId } from './constants'
import { useContract } from './hooks'
import { multicall } from './multicall'

interface Props {
  chainId: ChainId
  blockNumber: number | undefined
}

export function Updater({ chainId, blockNumber }: Props) {
  const contract = useContract(chainId)
  return <multicall.Updater chainId={chainId} latestBlockNumber={blockNumber} contract={contract} />
}
