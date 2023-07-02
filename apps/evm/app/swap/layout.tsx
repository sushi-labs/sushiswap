import { Header } from './header'
import { Providers } from './providers'
import { HotJar } from '@sushiswap/ui/components/scripts'

export const metadata = {
  title: 'SushiSwap',
}

export default function SwapLayout({ children }: { children: React.ReactNode }) {
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
