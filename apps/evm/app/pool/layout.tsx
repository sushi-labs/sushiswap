import { HotJar } from '@sushiswap/ui/components/scripts'
import { BobaAvaxAlert } from 'ui/shared/boba-avax-alert'

import { Header } from './header'
import { Providers } from './providers'

export const metadata = {
  title: 'Pool 💦',
}

export default function PoolLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Providers>
        <Header />
        <BobaAvaxAlert />
        <div className="flex flex-col flex-1">{children}</div>
      </Providers>
      <HotJar />
    </>
  )
}
