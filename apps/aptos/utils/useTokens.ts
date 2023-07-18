import { useWallet } from '@aptos-labs/wallet-adapter-react'
import TOKENS from './../config/tokenList.json'
import { Token } from './tokenType'
import { useMemo } from 'react'
import { useLocalStorage } from '@sushiswap/hooks'
export type Data = {
  chainId: number
  address: string
  decimals: number
  name: string | undefined
  symbol: string | undefined
}

export function useTokens() {
  const { network } = useWallet()
  const [value, setValue] = useLocalStorage<Token[]>('sushi.customTokens.aptos', [])
  let tokens: Token[] = [] as Token[]
  const BASE_TOKENS = TOKENS.tokens

  Object.entries(BASE_TOKENS).forEach(([, value]) => {
    tokens.push(value)
  })
  Object.entries(value).forEach(([, value]) => {
    tokens.push(value)
  })
  console.log(tokens)
  tokens = useMemo(() => {
    return tokens
      .map((token) => token)
      .filter((token) => {
        return token.chainId == Number(network ? network?.chainId : 1)
      })
  }, [tokens])

  return { tokens }
}
