import { ChainId } from '@sushiswap/chain'
import { Breadcrumb, Container } from '@sushiswap/ui'
import { headers } from 'next/headers'
import React from 'react'

import { PoolHeader } from '../../../ui/pool/PoolHeader'
import { getPool } from './page'

export const metadata = {
  title: 'Pool 💦',
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: { id: string } }) {
  const [_chainId, address] = params.id.split(params.id.includes('%3A') ? '%3A' : ':') as [string, string]
  const chainId = Number(_chainId) as ChainId
  const pool = await getPool({ chainId, address })
  const headersList = headers()
  const referer = headersList.get('referer')

  return (
    <>
      <Container maxWidth="5xl" className="px-4">
        <Breadcrumb />
      </Container>
      <Container maxWidth="5xl" className="pt-10 px-4">
        <PoolHeader
          backUrl={referer?.includes('/pool?') ? referer.toString() : '/pool'}
          address={pool.address}
          pool={pool}
          apy={{ rewards: pool?.incentiveApr, fees: pool?.feeApr1d }}
        />
      </Container>
      <section className="flex flex-col flex-1 mt-4">
        <div className="bg-gray-50 dark:bg-white/[0.02] border-t border-accent pt-10 pb-20 h-full">{children}</div>
      </section>
    </>
  )
}
