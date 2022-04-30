import React from 'react'
import { ChainId } from '@sushiswap/chain'
import { tokenLists } from './token-lists'
import { getProvider } from '../../functions/getProvider'

interface Props {
  chainId: ChainId
}

export function Updater({ chainId }: Props) {
  const provider = getProvider(chainId)
  return <tokenLists.Updater chainId={chainId} library={provider} />
}
