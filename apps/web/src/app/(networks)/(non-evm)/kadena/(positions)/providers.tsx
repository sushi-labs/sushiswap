'use client'

import { PoolsFiltersProvider } from 'src/app/(networks)/_ui/pools-filters-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return <PoolsFiltersProvider>{children}</PoolsFiltersProvider>
}
