import { isSushiSwapV4ChainId } from '@sushiswap/graph-client/data-api'
import { Container } from '@sushiswap/ui'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { getEvmChainById } from 'sushi/evm'
import { isHash } from 'viem'
import { PoolHeader } from '~evm/[chainId]/pool/_ui/pool-header'
import { getCachedV4Pool } from '../_lib/get-cached-v4-pool'

export default async function Layout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string; poolId: string }>
}) {
  const params = await props.params

  const { children } = props

  const { chainId: _chainId, poolId } = params
  const chainId = +_chainId

  if (!isSushiSwapV4ChainId(chainId) || !isHash(poolId)) {
    return notFound()
  }

  const pool = (await getCachedV4Pool({ chainId, poolId }))!

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
