'use client'

import { Suspense } from 'react'
import { PoolsFiltersProvider } from 'src/app/(networks)/_ui/pools-filters-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <PoolsFiltersProvider>{children}</PoolsFiltersProvider>
    </Suspense>
  )
}
