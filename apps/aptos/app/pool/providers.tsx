'use client'

import { PoolProvider } from './Pool/PoolProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  return <PoolProvider>{children}</PoolProvider>
}
