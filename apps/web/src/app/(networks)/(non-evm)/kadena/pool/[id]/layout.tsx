import { Container } from '@sushiswap/ui'
import { PoolHeader } from '~kadena/_common/ui/Pools/PoolDetails/PoolHeader'
import { Header } from '~kadena/header'
import Providers from './add/providers'

export default async function PoolLayout(props: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const params = await props.params

  const { children } = props

  const poolId = params.id

  return (
    <Providers>
      <Header className="mb-16" />
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
