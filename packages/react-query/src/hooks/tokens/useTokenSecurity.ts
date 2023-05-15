import { ChainId } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { useQueries, UseQueryOptions } from '@tanstack/react-query'
import { useMemo } from 'react'

const SUPPORTED_CHAINS: ChainId[] = [
  ChainId.AVALANCHE,
  ChainId.FANTOM,
  ChainId.GNOSIS,
  ChainId.HARMONY,
  ChainId.ETHEREUM,
  ChainId.HECO,
  ChainId.ARBITRUM,
  ChainId.OPTIMISM,
]

interface TokenSecurity {
  buy_tax: string
  sell_tax: string
  cannot_buy: string
  cannot_sell_all: string
  slippage_modifiable: string
  is_honeypot: string
  transfer_pausable: string
  is_blacklisted: string
  is_whitelisted: string
}

const fetchTokenSecurity = async (currency: Token | undefined): Promise<TokenSecurity | undefined> =>
  currency &&
  (await fetch(
    `https://api.gopluslabs.io/api/v1/token_security/${currency.chainId}?contract_addresses=${currency.address}`
  )
    .then((data) => data.json() as Promise<{ result?: Record<string, TokenSecurity> }>)
    .then((data) => data?.result?.[currency.address.toLowerCase()]))

export const useTokenSecurity = (
  currencies: (Token | undefined)[],
  options: UseQueryOptions<TokenSecurity | undefined>
) => {
  const isChainIdSupported = useMemo(
    () => currencies.some(currency => currency && SUPPORTED_CHAINS.includes(currency.chainId)),
    [currencies]
  )

  const query = useQueries({
    queries: useMemo(() => currencies?.map((currency) => ({
      queryKey: ['useTokenSecurity', currency?.id],
      queryFn: () => fetchTokenSecurity(currency),
      options: {
        ...options,
        enabled: (options?.enabled === undefined || true)
          && currency && SUPPORTED_CHAINS.includes(currency.chainId)
      }
    })), [currencies, options])
  })

  const honeypots: string[] = useMemo(
    () =>
      query.reduce(
        (acc, cur, i) => (cur.data?.is_honeypot === '1' ? [...acc, (currencies[i] as Token).address] : acc),
        [] as string[]
      ),
    [query]
  )

  return { isChainIdSupported, query, honeypots }
}
