import { Container } from '@sushiswap/ui'
import { notFound } from 'next/navigation'
import { Header } from 'src/app/(networks)/_ui/header/header'
import { SUPPORTED_CHAIN_IDS } from 'src/config'
import { isEvmChainId } from 'sushi/evm'
import { Hero } from './hero'
import { NavigationItems } from './navigation-items'

export default async function ClaimLayout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string }>
}) {
  const params = await props.params

  const chainId = +params.chainId

  if (!isEvmChainId(chainId)) {
    return notFound()
  }

  return (
    <>
      <Header chainId={chainId} supportedNetworks={SUPPORTED_CHAIN_IDS} />
      <main className="flex flex-col h-full flex-1 animate-slide">
        <Container maxWidth="7xl" className="px-4 pt-16 pb-8">
          <Hero />
        </Container>
        <Container maxWidth="7xl" className="px-4 flex gap-2 pb-4">
          <NavigationItems chainId={chainId} />
        </Container>
        <section className="flex flex-col flex-1">
          <div className="bg-gray-50 dark:bg-white/[0.02] border-t border-accent pt-4 pb-10 min-h-screen">
            {props.children}
          </div>
        </section>
      </main>
    </>
  )
}
