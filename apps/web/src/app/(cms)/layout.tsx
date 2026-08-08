import { Suspense } from 'react'
import { Header } from './header'
import { Providers } from './providers'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <Suspense fallback={null}>
        <Header />
        <div className="h-full">{children}</div>
      </Suspense>
    </Providers>
  )
}
