import { Container } from '@sushiswap/ui'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BackButton } from 'src/app/(networks)/_ui/back-button'
import { isMerklChainId } from 'sushi/evm'

export const metadata: Metadata = {
  title: 'Incentivize',
  description:
    'Add rewards to a pool to incentivize liquidity providers joining in.',
}

export default async function Layout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string }>
}) {
  const params = await props.params

  const { children } = props

  const chainId = +params.chainId
  if (!isMerklChainId(chainId)) {
    return notFound()
  }

  return (
    <>
      <Container maxWidth="7xl" className="pt-6 px-4">
        <div className="flex flex-col gap-4">
          <div>
            <BackButton />
          </div>

          <div className="flex flex-col gap-1 mb-2">
            <h1 className="text-3xl md:text-4xl font-medium">
              {' '}
              Incentivize Liquidity
            </h1>
            <h2 className="md:text-lg text-muted-foreground">
              Add rewards to a pool to incentivize liquidity providers joining
              in.
            </h2>
          </div>
        </div>
      </Container>
      <section className="flex flex-col flex-1">
        <Container maxWidth="7xl" className="px-4 pb-10 md:pt-10 pt-5">
          {children}
        </Container>
      </section>
    </>
  )
}
