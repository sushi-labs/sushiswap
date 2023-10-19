import { Pool } from '@sushiswap/client'
import { Breadcrumb, Container } from '@sushiswap/ui'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import React from 'react'
import { PoolHeader } from '../../../ui/pool/PoolHeader'

export const metadata = {
  title: 'Pool 💦',
}

export default async function Layout({
  children,
  params,
}: { children: React.ReactNode; params: { id: string } }) {
  const [chainId, address] = params.id.split(
    params.id.includes('%3A') ? '%3A' : ':',
  ) as [string, string]
  const res = await fetch(
    `https://pools.sushi.com/api/v0/${chainId}/${address}`,
    { next: { revalidate: 60 } },
  )
  const pool = (await res.json()) as Pool
  if (!pool) {
    notFound()
  }
  const headersList = headers()
  const referer = headersList.get('referer')
  return (
    <>
      <Container maxWidth="5xl" className="px-4">
        <Breadcrumb />
      </Container>
      <Container maxWidth="5xl" className="pt-10 px-4">
        <PoolHeader
          backUrl={referer?.includes('/pool?') ? referer?.toString() : '/pool'}
          address={pool.address}
          pool={pool}
          apy={{ rewards: pool?.incentiveApr, fees: pool?.feeApr1d }}
        />
      </Container>
      <section className="flex flex-col flex-1 mt-4">
        <div className="bg-gray-50 dark:bg-white/[0.02] border-t border-accent pt-10 pb-20 h-full">
          <Container maxWidth="5xl" className="px-2 sm:px-4">
            {children}
          </Container>
        </div>
      </section>
    </>
  )
}
