import { Header } from './header'
import { Providers } from './providers'

export const metadata = {
  title: 'SushiSwap',
  description: 'A Decentralised Finance (DeFi) swap & cross chain swap app.',
}

export default function SwapLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <Header />
      {children}
    </Providers>
  )
}
