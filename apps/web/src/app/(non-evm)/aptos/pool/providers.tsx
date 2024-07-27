'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PoolProvider } from '~aptos/pool/ui/pool/add/pool-add-provider/pool-add-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <PoolProvider>{children}</PoolProvider>
    </QueryClientProvider>
  )
}
