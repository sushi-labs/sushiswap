'use client'

import { PoolsFiltersProvider } from '~aptos/pool/ui/pools/filters/pool-filters-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return <PoolsFiltersProvider>{children}</PoolsFiltersProvider>
}
