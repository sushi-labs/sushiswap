'use client'

import { isPoolChainId } from '@sushiswap/graph-client/data-api'
import { Container, LinkInternal } from '@sushiswap/ui'
import { useSearchParams } from 'next/navigation'
import { POOL_SUPPORTED_NETWORKS } from 'src/config'
import { PathnameButton } from 'src/ui/pathname-button'
import { PoolsFiltersProvider } from 'src/ui/pool'
import { SidebarContainer, SidebarProvider } from 'src/ui/sidebar'
import { ChainId, ChainKey } from 'sushi/chain'
import { Header } from '../header'
import notFound from '../not-found'
import { Hero } from './hero'

export default function PositionsLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { chainId: string }
}) {
  const chainId = +params.chainId as ChainId
  const searchParams = useSearchParams()

  if (!isPoolChainId(chainId)) {
    return notFound()
  }

  return (
    <SidebarProvider>
      <Header />
      <SidebarContainer
        shiftContent
        supportedNetworks={POOL_SUPPORTED_NETWORKS}
        unsupportedNetworkHref={'/ethereum/pool'}
      >
        <main className="flex flex-col h-full flex-1">
          <Container maxWidth="7xl" className="px-4 py-16">
            <Hero chainId={chainId} />
          </Container>
          <Container
            maxWidth="7xl"
            className="px-4 flex justify-between flex-wrap-reverse gap-4 pb-4"
          >
            <div className="flex flex-wrap items-center gap-2">
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
                href={`/${
                  ChainKey[chainId]
                }/rewards?${searchParams.toString()}`}
              >
                <PathnameButton
                  id="my-rewards"
                  pathname={`/${ChainKey[chainId]}/rewards`}
                  asChild
                  size="sm"
                >
                  My Rewards
                </PathnameButton>
              </LinkInternal>
              <LinkInternal
                shallow={true}
                scroll={false}
                href={`/${
                  ChainKey[chainId]
                }/migrate?${searchParams.toString()}`}
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
            </div>
          </Container>
          <section className="flex flex-col flex-1">
            <div className="bg-gray-50 dark:bg-white/[0.02] border-t border-accent pt-4 pb-10 min-h-screen">
              <PoolsFiltersProvider>{children}</PoolsFiltersProvider>
            </div>
          </section>
        </main>
      </SidebarContainer>
    </SidebarProvider>
  )
}
