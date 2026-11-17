'use client'

import { Button, type ButtonProps } from '@sushiswap/ui'
import type { ReactNode } from 'react'
import { useCountryCode } from 'src/lib/hooks/use-country-code'
import { getRobinhoodTokenRestrictedCountries } from 'src/lib/robinhood/token-restrictions'
import { useRobinhoodStockTokens } from 'src/lib/robinhood/use-robinhood-stock-tokens'
import { EvmChainId, type EvmToken } from 'sushi/evm'
import type { StellarChainId } from 'sushi/stellar'
import type { SvmChainId } from 'sushi/svm'

type SwapCurrency = CurrencyFor<EvmChainId | SvmChainId | StellarChainId>

export type StockTokenRegionProps = ButtonProps & {
  token0?: SwapCurrency
  token1?: SwapCurrency
}

export function StockTokenRegion({
  token0,
  token1,
  children,
  ...props
}: StockTokenRegionProps): ReactNode {
  if (
    process.env.NEXT_PUBLIC_APP_ENV === 'test' ||
    process.env.NODE_ENV === 'development'
  ) {
    return <>{children}</>
  }

  const tokens = [token0, token1].filter(
    (token): token is EvmToken =>
      token?.chainId === EvmChainId.ROBINHOOD && token.type === 'token',
  )

  // Keep other chains and native currencies out of both lookup paths.
  if (tokens.length === 0) return <>{children}</>

  return (
    <RobinhoodTokenRegion tokens={tokens} {...props}>
      {children}
    </RobinhoodTokenRegion>
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

function RobinhoodTokenRegion({
  tokens,
  children,
  ...props
}: ButtonProps & { tokens: EvmToken[] }): ReactNode {
  const { data: stockTokens, isPending, isError } = useRobinhoodStockTokens()

  if (isPending) {
    return (
      <UnavailableButton {...props}>
        Checking token availability
      </UnavailableButton>
    )
  }

  if (isError || !stockTokens) {
    return (
      <UnavailableButton {...props}>
        Unable to verify stock tokens
      </UnavailableButton>
    )
  }

  const restrictions = tokens
    .map((token) => ({
      token,
      countries: getRobinhoodTokenRestrictedCountries(token, stockTokens),
    }))
    .filter(({ countries }) => countries.size > 0)
  if (restrictions.length === 0) return <>{children}</>

  return (
    <StockTokenCountryRegion restrictions={restrictions} {...props}>
      {children}
    </StockTokenCountryRegion>
  )
}

function StockTokenCountryRegion({
  restrictions,
  children,
  ...props
}: ButtonProps & {
  restrictions: { token: EvmToken; countries: ReadonlySet<string> }[]
}): ReactNode {
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

  const restrictedTokens = restrictions
    .filter(({ countries }) => countries.has(countryCode))
    .map(({ token }) => token)

  if (restrictedTokens.length > 0) {
    const symbols = [
      ...new Set(
        restrictedTokens.map(
          (token) => token.symbol || token.name || 'Stock token',
        ),
      ),
    ]
    return (
      <UnavailableButton {...props}>
        {symbols.join(', ')} unavailable in your region
      </UnavailableButton>
    )
  }

  return <>{children}</>
}
