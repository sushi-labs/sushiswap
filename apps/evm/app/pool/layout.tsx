import { Header } from './header'
import { Providers } from './providers'

export const metadata = {
  title: 'SushiPool',
}

export default function PoolLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <Header />
      {children}
    </Providers>
  )
}
