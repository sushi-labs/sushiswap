import { EvmChainId, type EvmToken } from 'sushi/evm'
import { isAddressEqual } from 'viem'
import { ROBINHOOD_STOCK_TOKEN_RESTRICTED_COUNTRIES } from './restricted-countries'
import { type RobinhoodStockToken, isRobinhoodStockToken } from './stock-tokens'

type TokenRestriction = Pick<EvmToken, 'chainId' | 'address'> & {
  countries: ReadonlySet<string>
}

// Add contract-specific rules here; these apply even if the registry omits a
// token. Country codes are ISO 3166-1 alpha-2 and do not affect other contracts.
export const ROBINHOOD_TOKEN_RESTRICTIONS: readonly TokenRestriction[] = [
  {
    chainId: EvmChainId.ROBINHOOD,
    address: '0x80E10255A83B257F5A8674D363F547842aa53b8e', // TTEQ
    countries: new Set([
      // Keep the general stock restrictions even before registry inclusion.
      ...ROBINHOOD_STOCK_TOKEN_RESTRICTED_COUNTRIES,
      'AT', // Austria
      'EE', // Estonia
      'HU', // Hungary
      'SE', // Sweden
      'DK', // Denmark
    ]),
  },
]

export function getRobinhoodTokenRestrictedCountries(
  token: Pick<EvmToken, 'chainId' | 'address'>,
  stockTokens: readonly RobinhoodStockToken[],
): ReadonlySet<string> {
  const countries = new Set(
    isRobinhoodStockToken(token, stockTokens)
      ? ROBINHOOD_STOCK_TOKEN_RESTRICTED_COUNTRIES
      : [],
  )

  for (const restriction of ROBINHOOD_TOKEN_RESTRICTIONS) {
    if (
      restriction.chainId === token.chainId &&
      isAddressEqual(restriction.address, token.address)
    ) {
      for (const country of restriction.countries) countries.add(country)
    }
  }

  return countries
}
