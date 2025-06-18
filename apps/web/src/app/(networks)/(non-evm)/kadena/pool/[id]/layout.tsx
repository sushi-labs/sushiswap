import { Container } from '@sushiswap/ui'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import { GRAPHQL_ENDPOINT } from '~kadena/_common/lib/graphql/endpoint'
import { getPoolById } from '~kadena/_common/lib/graphql/queries/get-pool-by-id'
import { PoolHeader } from '~kadena/_common/ui/Pools/PoolDetails/PoolHeader'
import { ChainIdOperatorBanner } from '~kadena/_common/ui/Shared/chain-id-operator-banner'
import { Header } from '~kadena/header'
import Providers from './add/providers'

export default async function PoolLayout(props: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const params = await props.params

  const { children } = props

  const poolId = params.id

  const pool = await unstable_cache(
    async () => _getPool({ poolId }),
    ['kadena', 'pool', `kadena:${poolId}`],
    {
      revalidate: 60 * 15,
    },
  )()
  if (!pool) {
    return notFound()
  }

  return (
    <Providers>
      <Header className="mb-[56px]" />
      <ChainIdOperatorBanner />
      <Container maxWidth="5xl" className="px-4 py-4">
        <PoolHeader poolId={poolId} />
      </Container>
      <section className="flex flex-col flex-1 mt-4">
        <div className="bg-gray-50 dark:bg-white/[0.02] border-t border-accent pt-10 pb-20 h-full">
          {children}
        </div>
      </section>
    </Providers>
  )
}

const _getPool = async ({ poolId }: { poolId: string }) => {
  if (!poolId) {
    return false
  }
  try {
    const query = getPoolById({
      poolId,
      timeFrame: 'DAY',
      first: 1,
    })

    const res = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': process.env.KADINDEXER_API_KEY ?? '',
      },
      body: query,
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      throw new Error('Failed to fetch pool details')
    }

    const result = await res.json()

    const pool = result?.data?.pool
    if (pool) {
      return true
    }
    return false
  } catch (_error) {
    return false
  }
}
