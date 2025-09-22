import { Container } from '@sushiswap/ui'
import { headers } from 'next/headers'
import { PoolHeader } from '~tron/_common/ui/Pools/PoolDetails/pool-header'
import Providers from './providers'

export default async function PoolLayout(props: {
  children: React.ReactNode
  params: Promise<{ address: string }>
}) {
  const params = await props.params

  const { children } = props

  const decodedPoolId = decodeURIComponent(params.address).split(':')
  const token0 = decodedPoolId[0]
  const token1 = decodedPoolId[1]
  const pairAddress = decodedPoolId[2]

  const headersList = await headers()
  const referer = headersList.get('referer')

  return (
    <Providers>
      <Container maxWidth="5xl" className="pt-10 px-4">
        <PoolHeader
          backUrl={
            referer?.includes('/pool?')
              ? referer?.toString()
              : `/tron/explore/pools`
          }
          token0={token0}
          token1={token1}
          pairAddress={pairAddress}
        />
      </Container>
      <section className="flex flex-col flex-1 mt-4">
        <div className="bg-gray-50 dark:bg-white/[0.02] border-t border-accent pt-10 pb-20 h-full">
          {children}
        </div>
      </section>
    </Providers>
  )
}
