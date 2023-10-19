import { useQuery } from '@tanstack/react-query'
import { ChainId } from 'sushi/chain'
import { Token } from 'sushi/currency'

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

const fetchTokenSecurityQueryFn = async (currencies: (Token | undefined)[]) => {
  const supportedCurrencies = currencies.filter(
    (currency) => currency && SUPPORTED_CHAINS.includes(currency.chainId),
  ) as Token[]

  const tokenSecurity = await Promise.all(
    supportedCurrencies.map((currency) =>
      fetch(
        `https://api.gopluslabs.io/api/v1/token_security/${currency.chainId}?contract_addresses=${currency.address}`,
      )
        .then(
          (response) =>
            response.json() as Promise<{
              result?: Record<string, TokenSecurity>
            }>,
        )
        .then((data) => data?.result?.[currency.address.toLowerCase()]),
    ),
  )

  const honeypots = tokenSecurity.reduce((acc, cur, i) => {
    const isHoneypot = cur?.is_honeypot === '1'
    const supportedCurrencyAddress = supportedCurrencies?.[i]?.address
    if (isHoneypot && typeof supportedCurrencyAddress === 'string') {
      return [...acc, supportedCurrencyAddress]
    }
    return acc
  }, [] as string[])

  return {
    tokenSecurity,
    honeypots,
    isSupported: supportedCurrencies.length > 0,
  }
}

export const useTokenSecurity = ({
  currencies,
  enabled = true,
}: {
  currencies: (Token | undefined)[]
  enabled?: boolean
}) => {
  return useQuery({
    queryKey: ['useTokenSecurity', currencies?.map((currency) => currency?.id)],
    queryFn: () => fetchTokenSecurityQueryFn(currencies),
    enabled,
    keepPreviousData: true,
    staleTime: 900000, // 15 mins
    cacheTime: 86400000, // 24hs
  })
}
