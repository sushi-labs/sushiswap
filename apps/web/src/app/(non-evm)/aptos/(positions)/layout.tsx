'use client'

import { PoolChainIds } from '@sushiswap/graph-client/data-api'
import { Container, LinkInternal } from '@sushiswap/ui'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { NonStandardChainId } from 'src/config'
import { PathnameButton } from 'src/ui/pool'
import { AptosSidebarContainer, SidebarProvider } from 'src/ui/sidebar'
import { PoolsFiltersProvider } from '~aptos/pool/ui/pools/filters/pool-filters-provider'
import { Header } from '../header'
import { Hero } from './hero'

const sidebarNetworks = [...PoolChainIds, NonStandardChainId.APTOS] as const

export default function TabsLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <Suspense>
      <Layout>{children}</Layout>
    </Suspense>
  )
}

function Layout({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()

  return (
    <SidebarProvider>
      <Header />
      <AptosSidebarContainer
        shiftContent
        supportedNetworks={sidebarNetworks}
        unsupportedNetworkHref={'/ethereum/pool'}
      >
        <main className="flex flex-col h-full flex-1">
          <Container maxWidth="7xl" className="px-4 py-16">
            <Hero />
          </Container>
          <Container maxWidth="7xl" className="px-4 pb-4">
            <div className="flex flex-wrap items-center gap-2">
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
            <div className="bg-gray-50 dark:bg-white/[0.02] border-t border-accent pt-4 pb-10 h-full">
              <PoolsFiltersProvider>{children}</PoolsFiltersProvider>
            </div>
          </section>
        </main>
      </AptosSidebarContainer>
    </SidebarProvider>
  )
}
