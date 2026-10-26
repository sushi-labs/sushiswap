'use client'

import { Button, type ButtonProps } from '@sushiswap/ui'
import type { ReactNode } from 'react'
import { useCountryCode } from 'src/lib/hooks/use-country-code'
import type { EvmChainId } from 'sushi/evm'
import { StellarChainId, type StellarToken } from 'sushi/stellar'
import type { SvmChainId } from 'sushi/svm'

type SwapCurrency = CurrencyFor<EvmChainId | SvmChainId | StellarChainId>

const STELLAR_RESTRICTED_COUNTRIES: ReadonlySet<string> = new Set([
  'US', // United States
])

const STELLAR_RESTRICTED_TOKENS = [
  {
    tokenSymbol: 'deHYB',
    tokenName: 'HYB deRWA',
    deployments: [
      {
        chainId: StellarChainId.STELLAR,
        contractAddress:
          'CCRTH4IJKVIBU6VQLRHFKDQYWXBEBJJXKDFNWVETLKUJJ7U62HBAZOIH',
      },
    ],
  },
]

export type GeoBlockedTokensProps = ButtonProps & {
  token0?: SwapCurrency
  token1?: SwapCurrency
  tokens?: readonly (SwapCurrency | undefined)[]
}

export function GeoBlockedTokens({
  token0,
  token1,
  tokens = [],
  children,
  ...props
}: GeoBlockedTokensProps): ReactNode {
  if (
    process.env.NEXT_PUBLIC_APP_ENV === 'test' ||
    process.env.NODE_ENV === 'development'
  ) {
    return <>{children}</>
  }

  const stellarTokens = [token0, token1, ...tokens].filter(
    (token): token is StellarToken =>
      token?.chainId === StellarChainId.STELLAR && token.type === 'token',
  )

  // Only Stellar tokens can require a region lookup.
  if (stellarTokens.length === 0) return <>{children}</>

  return (
    <StellarTokenRegion tokens={stellarTokens} {...props}>
      {children}
    </StellarTokenRegion>
  )
}

function UnavailableButton({
  fullWidth = true,
  size = 'xl',
  children,
  ...props
}: ButtonProps): ReactNode {
  return (
    <Button fullWidth={fullWidth} size={size} {...props} disabled>
      {children}
    </Button>
  )
}

function StellarTokenRegion({
  tokens,
  children,
  ...props
}: ButtonProps & { tokens: StellarToken[] }): ReactNode {
  const restrictedTokens = tokens.filter((token) =>
    STELLAR_RESTRICTED_TOKENS.some((restrictedToken) =>
      restrictedToken.deployments.some(
        (deployment) =>
          deployment.chainId === StellarChainId.STELLAR &&
          deployment.contractAddress.toLowerCase() ===
            token.address.toLowerCase(),
      ),
    ),
  )
  if (restrictedTokens.length === 0) return <>{children}</>

  return (
    <TokenCountryRegion tokens={restrictedTokens} {...props}>
      {children}
    </TokenCountryRegion>
  )
}

function TokenCountryRegion({
  tokens,
  children,
  ...props
}: ButtonProps & { tokens: StellarToken[] }): ReactNode {
  const { data: countryCode, isPending, isError } = useCountryCode()

  if (isPending) {
    return (
      <UnavailableButton {...props}>Checking your region</UnavailableButton>
    )
  }

  if (isError || !countryCode) {
    return (
      <UnavailableButton {...props}>
        Unable to verify your region
      </UnavailableButton>
    )
  }

  if (STELLAR_RESTRICTED_COUNTRIES.has(countryCode)) {
    const symbols = [
      ...new Set(tokens.map((token) => token.symbol || token.name || 'Token')),
    ]
    return (
      <UnavailableButton {...props}>
        {symbols.join(', ')} unavailable in your region
      </UnavailableButton>
    )
  }

  return <>{children}</>
}
