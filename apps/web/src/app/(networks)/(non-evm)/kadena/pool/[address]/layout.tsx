import { Container } from '@sushiswap/ui'
import { headers } from 'next/headers'
import { PoolHeader } from '~kadena/_common/ui/Pools/PoolDetails/PoolHeader'
import { Header } from '~kadena/header'
import Providers from './add/providers'

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

  return (
    <Providers>
      <Header />
      <Container maxWidth="5xl" className="py-4 px-4">
        <PoolHeader token0={token0} token1={token1} pairAddress={pairAddress} />
      </Container>
      <section className="flex flex-col flex-1 mt-4">
        <div className="bg-gray-50 dark:bg-white/[0.02] border-t border-accent pt-10 pb-20 h-full">
          {children}
        </div>
      </section>
    </Providers>
  )
}
