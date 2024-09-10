import { V3Pool, getV3Pool } from '@sushiswap/graph-client/data-api'
import { Container } from '@sushiswap/ui'
import { unstable_cache } from 'next/cache'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { PoolHeader } from 'src/ui/pool/PoolHeader'
import { ChainId, ChainKey } from 'sushi/chain'
import { isSushiSwapV3ChainId } from 'sushi/config'
import { isAddress } from 'viem'

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { chainId: string; address: string }
}) {
  const { chainId: _chainId, address } = params
  const chainId = +_chainId as ChainId

  if (
    !isSushiSwapV3ChainId(chainId) ||
    !isAddress(address, { strict: false })
  ) {
    return notFound()
  }

  const pool = (await unstable_cache(
    async () => getV3Pool({ chainId, address }),
    ['pool', `${chainId}:${address}`],
    {
      revalidate: 60 * 15,
    },
  )()) as V3Pool

  const headersList = headers()
  const referer = headersList.get('referer')
  return (
    <Container maxWidth="5xl" className="pt-10 px-4">
      <PoolHeader
        backUrl={
          referer?.includes('/pool')
            ? referer?.toString()
            : `/${ChainKey[chainId]}/explore/pools`
        }
        address={address}
        pool={pool}
        apy={{ rewards: pool.incentiveApr, fees: pool.feeApr1d }}
      />
      <section className="flex flex-col flex-1 h-full pb-10">
        {children}
      </section>
    </Container>
  )
}
