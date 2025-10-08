import { type V2Pool, getV2Pool } from '@sushiswap/graph-client/data-api'
import { Container } from '@sushiswap/ui'
import ms from 'ms'
import { unstable_cache } from 'next/cache'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import type React from 'react'
import { PoolHeader } from 'src/ui/pool/PoolHeader'
import {
  type EvmChainId,
  getEvmChainById,
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

  if (
    !isSushiSwapV2ChainId(chainId) ||
    !isAddress(address, { strict: false })
  ) {
    return notFound()
  }

  const pool = (await unstable_cache(
    async () => getV2Pool({ chainId, address }, { retries: 3 }),
    ['v2', 'pool', `${chainId}:${address}`],
    {
      revalidate: ms('15m'),
    },
  )()) as V2Pool

  const headersList = await headers()
  const referer = headersList.get('referer')
  return (
    <>
      <Container maxWidth="screen-3xl" className="px-4 pt-10">
        <PoolHeader
          backUrl={
            referer?.includes('/pool')
              ? referer?.toString()
              : `/${getEvmChainById(chainId)?.key}/explore/pools`
          }
          address={pool.address}
          pool={{
            ...pool,
            // @ts-expect-error
            // okay until we have a blade pool type
            protocol: 'BLADE',
          }}
          apy={{ rewards: pool?.incentiveApr, fees: pool?.feeApr1d }}
          showAddLiquidityButton={true}
        />
      </Container>
      <section className="flex flex-col flex-1 mt-4">
        <div className="h-full md:py-7">{children}</div>
      </section>
    </>
  )
}
