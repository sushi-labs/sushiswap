import { ChainId } from '@sushiswap/chain'
import React from 'react'
import { useProvider } from 'wagmi'

import { tokenLists } from './token-lists'

interface Props {
  chainId: ChainId
}

export function Updater({ chainId }: Props) {
  const provider = useProvider({ chainId })
  return <tokenLists.Updater chainId={chainId} provider={provider} />
}
