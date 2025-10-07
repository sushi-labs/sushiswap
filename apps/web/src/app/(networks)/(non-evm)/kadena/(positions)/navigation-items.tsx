'use client'

import { LinkInternal } from '@sushiswap/ui'
import { useSearchParams } from 'next/navigation'
import { PathnameButton } from 'src/app/_ui/pathname-button'

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
    </>
  )
}
