import { Metadata } from 'next'
import { Header } from '../../header'
import { PoolProvider } from './pool-provider'

export const metadata: Metadata = {
  title: 'Pool',
}

export default function PoolLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <PoolProvider>
      <Header />
      {children}
    </PoolProvider>
  )
}
