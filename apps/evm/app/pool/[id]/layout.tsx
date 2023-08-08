import { ChainId } from '@sushiswap/chain'
import { Container } from '@sushiswap/ui'
import React from 'react'

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
      <Container maxWidth="5xl" className="pt-10 px-4">
        <PoolHeader address={pool.address} pool={pool} apy={{ rewards: pool?.incentiveApr, fees: pool?.feeApr1d }} />
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
