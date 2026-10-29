import type { SushiSwapV4ChainId } from '@sushiswap/graph-client/data-api'
import { Container } from '@sushiswap/ui'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import { getEvmChainById } from 'sushi/evm'
import type { Hex } from 'viem'
import { PoolHeader } from '~evm/[chainId]/pool/_ui/pool-header'
import { getCachedV4Pool } from '../_lib/get-cached-v4-pool'

export async function PoolHeaderLayoutV4({
  chainId,
  poolId,
  children,
}: {
  chainId: SushiSwapV4ChainId
  poolId: Hex
  children: ReactNode
}) {
  const pool = await getCachedV4Pool({ chainId, poolId })

  if (!pool) {
    return notFound()
  }

  const headersList = await headers()
  const referer = headersList.get('referer')
  return (
    <>
      <Container maxWidth="5xl" className="pt-10 px-4">
        <PoolHeader
          backUrl={
            referer?.includes('/pool')
              ? referer?.toString()
              : `/${getEvmChainById(chainId).key}/explore/pools`
          }
          address={poolId}
          pool={pool}
          apy={{ rewards: pool.incentiveApr, fees: pool.feeApr1d }}
        />
      </Container>
      <section className="flex flex-col flex-1 mt-4">
        <div className="bg-gray-50 dark:bg-white/[0.02] border-t border-accent py-10 h-full">
          {children}
        </div>
      </section>
    </>
  )
}
