import { isAddress } from '@ethersproject/address'
import { ChainId } from '@sushiswap/chain'
import { Currency, Native } from '@sushiswap/currency'
import { useTokens } from 'lib/state/token-lists'

export function useCurrency({ chainId = ChainId.ETHEREUM, id }: { chainId: number; id: string }): Currency {
  const tokens = useTokens(chainId)
  return isAddress(id) ? tokens?.[id] : Native.onChain(chainId)
}
