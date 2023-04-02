import { SupportedChainId } from 'config'
import { useProvider } from '@sushiswap/wagmi'

import { tokenLists } from './token-lists'

interface Props {
  chainId: SupportedChainId
}

// Wagmi wrapper for redux token lists
export function Updater({ chainId }: Props) {
  const provider = useProvider({ chainId })
  return <tokenLists.Updater chainId={chainId} provider={provider} />
}
