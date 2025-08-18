import { useQuery } from '@tanstack/react-query'
import { formatTokenBalance } from '~stellar/_common/lib/utils/formatters'
import { useStellarWallet } from '~stellar/providers'
import { getTokenBalance } from '../soroban/token-helpers'
import type { Token } from '../types/token.type'

export const useTokenBalances = (tokens: Token[]) => {
  const { connectedAddress } = useStellarWallet()

  return useQuery({
    queryKey: ['useTokenBalances', connectedAddress],
    queryFn: async () => {
      if (!connectedAddress) {
        return tokens.reduce(
          (acc, token) => {
            acc[token.code] = { balance: 0n, formattedBalance: '-' }
            return acc
          },
          {} as Record<string, { balance: bigint; formattedBalance: string }>,
        )
      }

      const balances = await Promise.all(
        tokens.map((token) => getTokenBalance(connectedAddress, token)),
      )

      return tokens.reduce(
        (acc, token, index) => {
          acc[token.code] = {
            balance: balances[index],
            formattedBalance: formatTokenBalance(balances[index], token),
          }
          return acc
        },
        {} as Record<string, { balance: bigint; formattedBalance: string }>,
      )
    },
    refetchInterval: 2000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    enabled: !!connectedAddress,
  })
}
