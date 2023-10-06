import { Container } from '@sushiswap/ui'
import { HotJar } from '@sushiswap/ui/components/scripts'

import { Header } from './header'
import { Providers } from './providers'

export const metadata = {
  title: 'Analytics',
}

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Providers>
        <Header />
        <Container maxWidth="full" className="lg:mx-auto h-full">
          <div className="pb-4 mt-10 mb-4 lg:mb-40 xl:mt-20">{children}</div>
        </Container>
      </Providers>
      <HotJar />
    </>
  )
}
