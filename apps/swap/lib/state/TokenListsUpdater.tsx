import { ChainId } from '@sushiswap/chain'
import { useProvider } from 'wagmi'

import { tokenLists } from './token-lists'

interface Props {
  chainId: ChainId
}

// Wagmi wrapper for redux token lists
export function Updater({ chainId }: Props) {
  const provider = useProvider({ chainId })
  return <tokenLists.Updater chainId={chainId} library={provider} />
}
