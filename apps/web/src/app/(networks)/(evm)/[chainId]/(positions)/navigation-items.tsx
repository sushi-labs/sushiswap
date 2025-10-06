'use client'

import { LinkInternal } from '@sushiswap/ui'
import { useSearchParams } from 'next/navigation'
import { PathnameButton } from 'src/app/_ui/pathname-button'
import { type EvmChainId, getEvmChainById } from 'sushi/evm'

export function NavigationItems({ chainId }: { chainId: EvmChainId }) {
  const searchParams = useSearchParams()

  return (
    <>
      <LinkInternal
        shallow={true}
        scroll={false}
        href={`/${getEvmChainById(chainId).key}/pool?${searchParams.toString()}`}
      >
        <PathnameButton
          id="my-positions"
          pathname={`/${getEvmChainById(chainId).key}/pool`}
          asChild
          size="sm"
        >
          My Positions
        </PathnameButton>
      </LinkInternal>
      <LinkInternal
        shallow={true}
        scroll={false}
        href={`/${getEvmChainById(chainId).key}/migrate?${searchParams.toString()}`}
      >
        <PathnameButton
          id="migrate"
          pathname={`/${getEvmChainById(chainId).key}/migrate`}
          asChild
          size="sm"
        >
          Migrate
        </PathnameButton>
      </LinkInternal>
    </>
  )
}
