import { Button } from '@sushiswap/ui'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { getEvmChainById } from 'sushi/evm'
import { launchpadProviderHasCapability } from '../_lib/launchpad-provider'
import type { LaunchpadToken } from '../types'

type CreatorLinkToken = Pick<LaunchpadToken, 'chainId' | 'creator' | 'provider'>

export function LaunchpadCreatorLink({
  token,
  children,
  className,
}: {
  token: CreatorLinkToken
  children: ReactNode
  className?: string
}) {
  if (launchpadProviderHasCapability(token.provider, 'creatorProfile')) {
    const chainKey = getEvmChainById(token.chainId).key
    return (
      <Link
        href={`/${chainKey}/launchpad/creator/${token.creator}`}
        className={className}
      >
        {children}
      </Link>
    )
  }

  return (
    <a
      href={getEvmChainById(token.chainId).getAccountUrl(token.creator)}
      target="_blank"
      rel="noreferrer"
      className={className}
    >
      {children}
    </a>
  )
}

export function LaunchpadCreatorButton({ token }: { token: CreatorLinkToken }) {
  const hasCreatorProfile = launchpadProviderHasCapability(
    token.provider,
    'creatorProfile',
  )

  if (hasCreatorProfile) {
    const chainKey = getEvmChainById(token.chainId).key
    return (
      <Button asChild variant="perps-secondary" size="xs">
        <Link href={`/${chainKey}/launchpad/creator/${token.creator}`}>
          Profile
        </Link>
      </Button>
    )
  }

  return (
    <Button asChild variant="perps-secondary" size="xs">
      <a
        href={getEvmChainById(token.chainId).getAccountUrl(token.creator)}
        target="_blank"
        rel="noreferrer"
      >
        Explorer
      </a>
    </Button>
  )
}
