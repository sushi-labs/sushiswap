'use client'

import { LinkInternal } from '@sushiswap/ui'
import { useSearchParams } from 'next/navigation'
import { PathnameButton } from 'src/ui/pathname-button'

export function NavigationItems() {
  const searchParams = useSearchParams()

  return (
    <>
      <LinkInternal
        shallow
        scroll={false}
        href={`/kadena/pool?${searchParams.toString()}`}
      >
        <PathnameButton
          id="my-positions"
          pathname="/kadena/pool"
          asChild
          size="sm"
        >
          My Positions
        </PathnameButton>
      </LinkInternal>

      <LinkInternal shallow scroll={false} href={`/claim/rewards`}>
        <PathnameButton
          id="my-positions"
          pathname="/claim/rewards"
          asChild
          size="sm"
        >
          My Rewards
        </PathnameButton>
      </LinkInternal>

      <LinkInternal shallow scroll={false} href={`/ethereum/migrate`}>
        <PathnameButton
          id="my-positions"
          pathname="/ethereum/migrate"
          asChild
          size="sm"
        >
          Migrate
        </PathnameButton>
      </LinkInternal>
    </>
  )
}
