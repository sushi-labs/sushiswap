'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PoolProvider } from './Pool/PoolProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <PoolProvider>{children}</PoolProvider>
    </QueryClientProvider>
  )
}
