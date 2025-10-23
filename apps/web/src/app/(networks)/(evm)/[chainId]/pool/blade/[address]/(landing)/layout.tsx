import { type BladePool, getBladePool } from '@sushiswap/graph-client/data-api'
import { Container } from '@sushiswap/ui'
import ms from 'ms'
import { unstable_cache } from 'next/cache'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import type React from 'react'
import { PoolHeader } from 'src/ui/pool/PoolHeader'
import { PoolHeaderBlade } from 'src/ui/pool/PoolHeaderBlade'
import {
  type EvmChainId,
  getEvmChainById,
  isBladeChainId,
  isSushiSwapV2ChainId,
} from 'sushi/evm'
import { isAddress } from 'viem'

export default async function Layout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string; address: string }>
}) {
  const params = await props.params

  const { children } = props

  const { chainId: _chainId, address } = params
  const chainId = +_chainId as EvmChainId

  if (!isBladeChainId(chainId) || !isAddress(address, { strict: false })) {
    return notFound()
  }

  const pool = (await unstable_cache(
    async () => getBladePool({ chainId, address }, { retries: 3 }),
    ['blade', 'pool', `${chainId}:${address}`],
    {
      revalidate: ms('15m'),
    },
  )()) as BladePool

  const headersList = await headers()
  const referer = headersList.get('referer')
  return (
    <>
      <Container maxWidth="screen-3xl" className="px-4 pt-10">
        <PoolHeaderBlade
          backUrl={
            referer?.includes('/pool')
              ? referer?.toString()
              : `/${getEvmChainById(chainId)?.key}/explore/pools`
          }
          address={pool?.address ?? ''}
          pool={pool}
          showAddLiquidityButton={true}
        />
      </Container>
      <section className="flex flex-col flex-1 mt-4">
        <div className="h-full md:py-7">{children}</div>
      </section>
    </>
  )
}
