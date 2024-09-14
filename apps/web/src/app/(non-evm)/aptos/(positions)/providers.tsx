'use client'

import { Suspense } from 'react'
import { PoolsFiltersProvider } from '~aptos/pool/ui/pools/filters/pool-filters-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <PoolsFiltersProvider>{children}</PoolsFiltersProvider>
    </Suspense>
  )
}
