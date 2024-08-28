import { Metadata } from 'next'
import { PoolProvider } from './pool-provider'

export const metadata: Metadata = {
  title: 'Pool',
}

export default function PoolLayout({
  children,
}: { children: React.ReactNode }) {
  return <PoolProvider>{children}</PoolProvider>
}
