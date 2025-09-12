import { getPool } from '@sushiswap/graph-client/kadena'
import { Container } from '@sushiswap/ui'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import { PoolHeader } from '~kadena/_common/ui/Pools/PoolDetails/PoolHeader'
import { Header } from '~kadena/header'
import Providers from './add/providers'

export default async function PoolLayout(props: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const params = await props.params
  const { children } = props

  const poolId = decodeURIComponent(params.id)

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
      <Header />
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
    const data = await getPool({
      poolId: decodeURIComponent(poolId),
      timeFrame: 'DAY',
      first: 1,
    })

    if (data.id) {
      return true
    }
    return false
  } catch (_error) {
    return false
  }
}
