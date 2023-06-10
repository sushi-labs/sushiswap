import { Header } from './Header'
import { Providers } from './providers'

export const metadata = {
  title: 'SushiSwap 🍣 | Sushi',
}

export default function SwapLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <Header />
      {children}
    </Providers>
  )
}
