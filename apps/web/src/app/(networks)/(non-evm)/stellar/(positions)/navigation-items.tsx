'use client'

import { LinkInternal } from '@sushiswap/ui'
import { useSearchParams } from 'next/navigation'
import { PathnameButton } from 'src/ui/pathname-button'

export function NavigationItems() {
  const searchParams = useSearchParams()

  return (
    <>
      <LinkInternal
        shallow={true}
        scroll={false}
        href={`/stellar/pool?${searchParams.toString()}`}
      >
        <PathnameButton
          id="my-positions"
          pathname={`/stellar/pool`}
          asChild
          size="sm"
        >
          My Positions
        </PathnameButton>
      </LinkInternal>
    </>
  )
}
