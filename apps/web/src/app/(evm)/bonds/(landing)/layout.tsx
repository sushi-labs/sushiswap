'use client'

import { Container, LinkInternal } from '@sushiswap/ui'
import { useSearchParams } from 'next/navigation'

import { PathnameButton } from 'src/ui/pool'
import { Hero } from '../hero'

export default function TabsLayout({
  children,
}: { children: React.ReactNode }) {
  const searchParams = useSearchParams()

  return (
    <>
      <Container maxWidth="7xl" className="px-4 pt-20 pb-10">
        <Hero />
      </Container>
      <Container maxWidth="7xl" className="px-4">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <LinkInternal
            shallow={true}
            scroll={false}
            href={`/bonds?${searchParams.toString()}`}
          >
            <PathnameButton
              id="all-bonds"
              pathname={'/bonds'}
              asChild
              size="sm"
            >
              All Markets
            </PathnameButton>
          </LinkInternal>
          <LinkInternal
            shallow={true}
            scroll={false}
            href={`/bonds/my-bonds?${searchParams.toString()}`}
          >
            <PathnameButton
              id="my-bonds"
              pathname={'/bonds/my-bonds'}
              asChild
              size="sm"
            >
              My Bonds
            </PathnameButton>
          </LinkInternal>
        </div>
      </Container>
      <section className="flex flex-col flex-1">
        <div className="bg-gray-50 dark:bg-white/[0.02] border-t border-accent pt-4 pb-10 h-full">
          {children}
        </div>
      </section>
    </>
  )
}
