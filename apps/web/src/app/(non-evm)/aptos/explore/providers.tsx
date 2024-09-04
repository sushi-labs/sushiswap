'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PoolsFiltersProvider } from '~aptos/pool/ui/pools/filters/pool-filters-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <PoolsFiltersProvider>{children}</PoolsFiltersProvider>
    </QueryClientProvider>
  )
}
