'use client'

import { Button, type ButtonProps, Dots } from '@sushiswap/ui'
import { type FC, type ReactNode, useMemo } from 'react'
import type { StellarAccountAddress, StellarToken } from 'sushi/stellar'
import {
  useNeedsTrustline,
  useNeedsTrustlines,
} from '~stellar/_common/lib/hooks/trustline/use-trustline'
import { CreateTrustlineButton } from '~stellar/_common/ui/Trustline/CreateTrustlineButton'

interface TrustlineProps extends ButtonProps {
  token: StellarToken | undefined
  children: ReactNode
}

const Trustline: FC<TrustlineProps> = ({
  token,
  children,
  fullWidth = true,
  size = 'xl',
  ...props
}) => {
  const enabled = Boolean(token)

  const { needsTrustline, isLoading, issuer } = useNeedsTrustline(token)

  if (!enabled) return <>{children}</>

  if (isLoading) {
    return (
      <Button {...props} fullWidth={fullWidth} size={size} loading disabled>
        Checking trustline
        <Dots />
      </Button>
    )
  }

  if (needsTrustline) {
    const trustlineIssuer = issuer ?? token!.issuer
    if (!trustlineIssuer) {
      return (
        <Button {...props} fullWidth={fullWidth} size={size} disabled>
          Trustline unavailable
        </Button>
      )
    }
    return (
      <CreateTrustlineButton
        tokens={[{ code: token!.symbol, issuer: trustlineIssuer }]}
        size={size}
        fullWidth={fullWidth}
      />
    )
  }

  return <>{children}</>
}

interface TrustlinesProps extends ButtonProps {
  tokens: Array<StellarToken | undefined>
  children: ReactNode
}

const Trustlines: FC<TrustlinesProps> = ({
  tokens,
  children,
  fullWidth = true,
  size = 'xl',
  ...props
}) => {
  const { results, isLoading, needsAnyTrustline } = useNeedsTrustlines(tokens)

  const tokensNeedingTrustline = useMemo(() => {
    const tokensNeedingTrustline: Array<{
      code: string
      issuer: StellarAccountAddress
    }> = []

    results.forEach((result, index) => {
      const token = tokens[index]

      if (result.needsTrustline && token && result.issuer) {
        tokensNeedingTrustline.push({
          code: token.symbol,
          issuer: result.issuer,
        })
      }
    })

    return tokensNeedingTrustline
  }, [results, tokens])

  if (isLoading) {
    return (
      <Button {...props} fullWidth={fullWidth} size={size} loading disabled>
        Checking trustlines
        <Dots />
      </Button>
    )
  }

  if (needsAnyTrustline) {
    if (tokensNeedingTrustline.length === 0) {
      return (
        <Button {...props} fullWidth={fullWidth} size={size} disabled>
          Trustline unavailable
        </Button>
      )
    }

    return (
      <CreateTrustlineButton
        tokens={tokensNeedingTrustline}
        size={size}
        fullWidth={fullWidth}
      />
    )
  }

  return <>{children}</>
}

export { Trustline, Trustlines, type TrustlineProps, type TrustlinesProps }
