import { HotJar } from '@sushiswap/ui/components/scripts'

import { Header } from './header'
import { Providers } from './providers'

export const metadata = {
  title: 'SushiAnalytics 📈',
}

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Providers>
        <Header />
        {children}
      </Providers>
      <HotJar />
    </>
  )
}
