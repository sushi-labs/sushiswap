import { Header } from './header'
import { Providers } from './providers'

export const metadata = {
  title: 'SushiSwap Simple',
}

export default function SwapSimpleLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <Header />
      {children}
    </Providers>
  )
}
