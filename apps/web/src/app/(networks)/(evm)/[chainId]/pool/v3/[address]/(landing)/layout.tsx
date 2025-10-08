import { type V3Pool, getV3Pool } from '@sushiswap/graph-client/data-api'
import { Container } from '@sushiswap/ui'
import { unstable_cache } from 'next/cache'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { PoolHeader } from 'src/ui/pool/PoolHeader'
import { getEvmChainById, isSushiSwapV3ChainId } from 'sushi/evm'
import { isAddress } from 'viem'

export default async function Layout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string; address: string }>
}) {
  const params = await props.params

  const { children } = props

  const { chainId: _chainId, address } = params
  const chainId = +_chainId

  if (
    !isSushiSwapV3ChainId(chainId) ||
    !isAddress(address, { strict: false })
  ) {
    return notFound()
  }

  const pool = (await unstable_cache(
    async () => getV3Pool({ chainId, address }, { retries: 3 }),
    ['v3', 'pool', `${chainId}:${address}`],
    {
      revalidate: 60 * 15,
    },
  )()) as V3Pool

  const headersList = await headers()
  const referer = headersList.get('referer')
  return (
    <>
      <Container maxWidth="screen-3xl" className="px-4 pt-10">
        <PoolHeader
          backUrl={
            referer?.includes('/pool')
              ? referer?.toString()
              : `/${getEvmChainById(chainId).key}/explore/pools`
          }
          address={address}
          pool={pool}
          apy={{ rewards: pool.incentiveApr, fees: pool.feeApr1d }}
          showAddLiquidityButton
        />
      </Container>
      <section className="flex flex-col flex-1 mt-4">
        <div className="h-full md:py-7">{children}</div>
      </section>
    </>
  )
}
