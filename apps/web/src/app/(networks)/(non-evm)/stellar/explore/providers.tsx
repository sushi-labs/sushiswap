'use client'

import { Card, CardHeader, SkeletonText } from '@sushiswap/ui'
import { Suspense } from 'react'
import { PoolsFiltersProvider } from 'src/app/(networks)/_ui/pools-filters-provider'

function PoolsTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="!w-28 !h-[18px]">
          <SkeletonText />
        </div>
      </CardHeader>
      <div className="p-4 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <SkeletonText className="w-1/4" />
            <SkeletonText className="w-1/6" />
            <SkeletonText className="w-1/6" />
            <SkeletonText className="w-1/6" />
          </div>
        ))}
      </div>
    </Card>
  )
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<PoolsTableSkeleton />}>
      <PoolsFiltersProvider>{children}</PoolsFiltersProvider>
    </Suspense>
  )
}
