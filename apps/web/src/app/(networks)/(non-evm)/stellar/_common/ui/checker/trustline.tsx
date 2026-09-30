'use client'

import { Button, type ButtonProps } from '@sushiswap/ui'
import type { ReactElement, ReactNode } from 'react'
import type { StellarToken } from 'sushi/stellar'
import { useNeedsTrustlines } from '~stellar/_common/lib/hooks/trustline/use-trustline'
import { CreateTrustlineButton } from '~stellar/_common/ui/trustline/create-trustline-button'

export interface TrustlineProps extends ButtonProps {
  token: StellarToken | undefined
  children: ReactNode
}

interface TrustlinesProps extends ButtonProps {
  tokens: (StellarToken | undefined)[]
  children: ReactNode
}

export function Trustline({ token, ...props }: TrustlineProps): ReactElement {
  return <Trustlines tokens={[token]} {...props} />
}

export function Trustlines({
  tokens,
  children,
  fullWidth = true,
  size = 'xl',
  ...props
}: TrustlinesProps): ReactElement {
  const definedTokens = tokens.filter((token): token is StellarToken =>
    Boolean(token),
  )
  const { results, isLoading, isError, refetch } =
    useNeedsTrustlines(definedTokens)
  if (isError)
    return (
      <Button
        {...props}
        fullWidth={fullWidth}
        size={size}
        onClick={() => void refetch()}
      >
        Trustlines unavailable — Retry
      </Button>
    )
  if (isLoading)
    return (
      <Button {...props} fullWidth={fullWidth} size={size} loading disabled>
        Checking trustlines
      </Button>
    )
  const needed = results.flatMap((result, index) =>
    result.needsTrustline && result.issuer
      ? [{ code: definedTokens[index].symbol, issuer: result.issuer }]
      : [],
  )
  if (needed.length)
    return (
      <CreateTrustlineButton
        {...props}
        fullWidth={fullWidth}
        size={size}
        tokens={needed}
      />
    )
  return <>{children}</>
}
