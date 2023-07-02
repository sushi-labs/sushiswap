import { Container } from '@sushiswap/ui'
import { HotJar } from '@sushiswap/ui/components/scripts'

import { Header } from './header'
import { Providers } from './providers'
export const metadata = {
  title: 'SushiAnalytics 📈',
}

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  return (
    <Container maxWidth="full" className="lg:mx-auto h-full">
      <div className="pb-4 mt-10 mb-4 lg:mb-40 xl:mt-20">
        <Providers>
          <Header />
          {children}
        </Providers>
        <HotJar />
      </div>
    </Container>
  )
}
