import { AddressZero } from '@ethersproject/constants'
import { ChainId } from '@sushiswap/chain'
import { Currency, Native } from '@sushiswap/currency'
import { useTokens } from 'lib/state/token-lists'

export function useCurrency({ chainId = ChainId.ETHEREUM, address }: { chainId: number; address: string }): Currency {
  // 1. TODO: Decide identifier for native currency... (use address zero? will for now)
  // 2. If native, Native.onChain(chainId) else get token from list (if available)
  // 3. Attach rebase ???
  const tokens = useTokens(chainId)
  return address === AddressZero ? Native.onChain(chainId) : tokens?.[address]
}
