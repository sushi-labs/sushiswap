import { AddressZero } from '@ethersproject/constants'
import { ChainId } from '@sushiswap/chain'
import { Currency, Native, NATIVE_ID } from '@sushiswap/currency'
import { useTokens } from 'lib/state/token-lists'

export function useCurrency({ chainId = ChainId.ETHEREUM, id }: { chainId: number; id: string }): Currency {
  const tokens = useTokens(chainId)

  const key = `${chainId}:${id}`
  
  return (key in NATIVE_ID) ? NATIVE_ID[key] : tokens?.[id]
}
