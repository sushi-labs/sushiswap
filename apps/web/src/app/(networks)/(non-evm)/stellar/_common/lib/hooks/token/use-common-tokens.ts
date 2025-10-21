import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { tokens } from '~stellar/_common/lib/assets/token-assets'
import { NETWORK_NAME } from '~stellar/_common/lib/constants'
import type { Token } from '~stellar/_common/lib/types/token.type'

/**
 * Returns common/popular tokens for quick selection
 * For now just return top 5
 */
const fetchCommonTokensQueryFn = async ({
  network,
}: { network: typeof NETWORK_NAME }) => {
  const baseTokens = tokens[network]
  const commonTokens = baseTokens.slice(0, 5)
  return commonTokens.reduce<Record<string, Token>>(
    (acc, { code, issuer, contract, name, org, domain, decimals, icon }) => {
      acc[contract] = {
        name,
        decimals,
        code,
        issuer,
        contract,
        org,
        domain,
        icon,
      }
      return acc
    },
    {},
  )
}

export function useCommonTokens() {
  return useQuery({
    queryKey: ['common-tokens', { network: NETWORK_NAME }],
    queryFn: () => fetchCommonTokensQueryFn({ network: NETWORK_NAME }),
    placeholderData: keepPreviousData,
  })
}
