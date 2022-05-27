import { ChainId } from '@sushiswap/chain'

import { Native } from './Native'

export function useNativeCurrency({ chainId = ChainId.ETHEREUM }: { chainId?: number }): Native {
  return Native.onChain(chainId)
}
