import { ChartPieIcon, MinusIcon, PlusIcon, UserIcon } from '@heroicons/react/24/outline'
import { ChainId } from '@sushiswap/chain'
import { Breadcrumb, Button, buttonIconVariants, Container, LinkInternal } from '@sushiswap/ui'
import React from 'react'

import { PathnameButton } from '../../../ui/pool'
import { PoolHeader } from '../../../ui/pool/PoolHeader'
import { getPool } from './page'

export const metadata = {
  title: 'Pool 💦',
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: { id: string } }) {
  const [chainId, address] = params.id.split('%3A') as [ChainId, string]
  const pool = await getPool({ chainId, address })

  return (
    <>
      <Container maxWidth="5xl" className="px-4">
        <Breadcrumb />
      </Container>
      <Container maxWidth="5xl" className="pt-10 px-4">
        <PoolHeader address={pool.address} pool={pool} apy={{ rewards: pool?.incentiveApr, fees: pool?.feeApr1d }} />
        <div className="flex flex-wrap justify-between gap-2 my-4">
          <div className="flex flex-wrap gap-2">
            <LinkInternal shallow={true} href={`/pool/${params.id}`}>
              <PathnameButton pathname={`/pool/${params.id}`} asChild size="sm">
                <ChartPieIcon className={buttonIconVariants({ size: 'sm' })} />
                Pool
              </PathnameButton>
            </LinkInternal>
            {pool.protocol !== 'SUSHISWAP_V3' ? (
              <>
                <LinkInternal shallow={true} href={`/pool/${params.id}/add`}>
                  <PathnameButton pathname={`/pool/${params.id}/add`} asChild size="sm">
                    <PlusIcon className={buttonIconVariants({ size: 'sm' })} />
                    Add liquidity
                  </PathnameButton>
                </LinkInternal>
                <LinkInternal shallow={true} href={`/pool/${params.id}/remove`}>
                  <PathnameButton pathname={`/pool/${params.id}/remove`} asChild size="sm">
                    <MinusIcon className={buttonIconVariants({ size: 'sm' })} />
                    Remove liquidity
                  </PathnameButton>
                </LinkInternal>
              </>
            ) : null}

            {pool.protocol === 'SUSHISWAP_V3' ? (
              <LinkInternal shallow={true} href={`/pool/${params.id}/positions`}>
                <PathnameButton pathname={`/pool/${params.id}/positions`} asChild size="sm">
                  <UserIcon className={buttonIconVariants({ size: 'sm' })} />
                  My Positions
                </PathnameButton>
              </LinkInternal>
            ) : null}
          </div>
          {pool.protocol === 'SUSHISWAP_V3' ? (
            <LinkInternal shallow={true} href={`/pool/${params.id}/positions/create`}>
              <Button icon={PlusIcon} asChild size="sm">
                Create position
              </Button>
            </LinkInternal>
          ) : null}
        </div>
      </Container>
      <section className="flex flex-col flex-1">
        <div className="bg-gray-50 dark:bg-white/[0.02] border-t border-accent pt-4 pb-20 h-full">
          <Container maxWidth="5xl" className="px-4">
            {children}
          </Container>
        </div>
      </section>
    </>
  )
}
