'use client'

import { Suspense } from 'react'
import { PoolsFiltersProvider } from 'src/app/(networks)/_ui/PoolsFiltersProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <PoolsFiltersProvider>{children}</PoolsFiltersProvider>
    </Suspense>
  )
}
