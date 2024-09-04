'use client'

import { Container, LinkInternal } from '@sushiswap/ui'
import { useSearchParams } from 'next/navigation'
import { PathnameButton } from '~aptos/(common)/components/PathnameButton'
import { Hero } from './hero'
import { Providers } from './providers'

export default function TabsLayout({
  children,
}: { children: React.ReactNode }) {
  const searchParams = useSearchParams()

  return (
    <>
      <Container maxWidth="7xl" className="px-4 py-16">
        <Hero />
      </Container>
      <Container maxWidth="7xl" className="px-4">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <LinkInternal
            shallow={true}
            scroll={false}
            href={`/aptos/pool?${searchParams.toString()}`}
          >
            <PathnameButton
              id="my-positions"
              pathname={'/aptos/pool'}
              asChild
              size="sm"
            >
              My Positions
            </PathnameButton>
          </LinkInternal>
          {/*<LinkInternal*/}
          {/*  shallow={true}*/}
          {/*  scroll={false}*/}
          {/*  href={`/pool/my-rewards?${searchParams.toString()}`}*/}
          {/*>*/}
          <PathnameButton
            disabled
            id="my-rewards"
            pathname={'/aptos/pool/my-rewards'}
            size="sm"
          >
            My Rewards
          </PathnameButton>
          {/*</LinkInternal>*/}
        </div>
      </Container>
      <section className="flex flex-col flex-1">
        <div className="bg-gray-50 dark:bg-white/[0.02] border-t border-accent pt-4 pb-20 h-full">
          <Providers>{children}</Providers>
        </div>
      </section>
    </>
  )
}
