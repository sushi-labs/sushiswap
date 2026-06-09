'use client'

import { Button, type ButtonProps, Dots } from '@sushiswap/ui'
import type { FC, ReactNode } from 'react'
import type { StellarToken } from 'sushi/stellar'
import { useNeedsTrustline } from '~stellar/_common/lib/hooks/trustline/use-trustline'
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
  const enabled = Boolean(token?.issuer)

  const { needsTrustline, isLoading, issuer } = useNeedsTrustline(
    enabled && token
      ? {
          code: token.symbol,
          contract: token.address,
          issuer: token.issuer ?? '',
        }
      : null,
  )

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

export { Trustline, type TrustlineProps }
