'use client'

import { Suspense } from 'react'
import { PoolsFiltersProvider } from '~kadena/pool/[id]/pool-filters-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <PoolsFiltersProvider>{children}</PoolsFiltersProvider>
    </Suspense>
  )
}
