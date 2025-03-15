'use client'

import { LinkInternal } from '@sushiswap/ui'
import { useSearchParams } from 'next/navigation'
import { PathnameButton } from 'src/ui/pathname-button'
import { type ChainId, ChainKey } from 'sushi/chain'

export function NavigationItems({ chainId }: { chainId: ChainId }) {
  const searchParams = useSearchParams()

  return (
    <>
      <LinkInternal
        shallow={true}
        scroll={false}
        href={`/${ChainKey[chainId]}/pool?${searchParams.toString()}`}
      >
        <PathnameButton
          id="my-positions"
          pathname={`/${ChainKey[chainId]}/pool`}
          asChild
          size="sm"
        >
          My Positions
        </PathnameButton>
      </LinkInternal>
      <LinkInternal
        shallow={true}
        scroll={false}
        href={`/${ChainKey[chainId]}/migrate?${searchParams.toString()}`}
      >
        <PathnameButton
          id="migrate"
          pathname={`/${ChainKey[chainId]}/migrate`}
          asChild
          size="sm"
        >
          Migrate
        </PathnameButton>
      </LinkInternal>
    </>
  )
}
