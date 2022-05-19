import { ChainId } from '@sushiswap/chain'

import { getProvider } from '../provider'
import { tokenLists } from './token-lists'

interface Props {
  chainId: ChainId
}

export function Updater({ chainId }: Props) {
  const provider = getProvider(chainId)
  return <tokenLists.Updater chainId={chainId} library={provider} />
}
