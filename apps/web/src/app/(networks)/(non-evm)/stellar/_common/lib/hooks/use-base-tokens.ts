import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { tokens } from '~stellar/_common/lib/assets/token-assets'
import type { Token } from '~stellar/_common/lib/types/token.type'
import { NETWORK_NAME } from '../constants'

/**
 * Gets the tokens without any alteration
 * @returns An array of Tokens
 */
export const getBaseTokens = () => {
  const baseTokens: Token[] = tokens[NETWORK_NAME]
  return baseTokens
}

/**
 * Constructs a list of tokens based off the network
 * @returns An object of token objects with the contract ID as the key name
 */
export const useBaseTokens = () => {
  return useQuery({
    queryKey: ['base-tokens', { NETWORK_NAME }],
    queryFn: () => {
      const baseTokens: Token[] = tokens[NETWORK_NAME]

      return baseTokens.reduce<Record<string, Token>>(
        (
          acc,
          { code, issuer, contract, name, org, domain, decimals, icon },
        ) => {
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
    },
    placeholderData: keepPreviousData,
  })
}
