import { ChainId } from '@sushiswap/chain'
import React from 'react'

import { getProvider } from '../../functions/getProvider'
import { tokenLists } from './token-lists'

interface Props {
  chainId: ChainId
}

export function Updater({ chainId }: Props) {
  const provider = getProvider(chainId)
  return <tokenLists.Updater chainId={chainId} library={provider} />
}
