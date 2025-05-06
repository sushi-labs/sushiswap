import { Container } from '@sushiswap/ui'
import { BarHeader } from 'src/ui/stake'
import { EvmChainId } from 'sushi/chain'
import { Header } from '~evm/[chainId]/header'
import { Providers } from './providers'

export const metadata = {
  title: 'Stake',
  description: 'Stake SUSHI in the SushiBar to earn more SUSHI.',
}

const supportedNetworks = [EvmChainId.ETHEREUM]

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <Header
        chainId={EvmChainId.ETHEREUM}
        supportedNetworks={supportedNetworks}
      />
      <div className="flex flex-col flex-1 overflow-y-auto animate-slide">
        <Container maxWidth="5xl" className="px-4 pt-16 mb-12">
          <BarHeader />
        </Container>
        <section className="flex flex-col flex-1">
          <div className="bg-gray-50 dark:bg-white/[0.02] border-t border-accent pt-9 pb-10 h-full">
            {children}
          </div>
        </section>
      </div>
    </Providers>
  )
}
