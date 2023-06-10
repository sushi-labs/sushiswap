import { Header } from './header'
import { Providers } from './providers'

export const metadata = {
  title: 'SushiSwap Avanced',
}

export default function SwapAdvancedLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <Header />
      {children}
    </Providers>
  )
}
