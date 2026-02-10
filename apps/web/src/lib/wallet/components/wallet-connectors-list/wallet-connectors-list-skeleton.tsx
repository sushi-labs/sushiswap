'use client'

import { Button, SkeletonCircle, SkeletonText } from '@sushiswap/ui'

export function WalletConnectorsListSkeleton() {
  return (
    <div>
      {Array.from(new Array(6)).map((_, i) => (
        <Button
          key={`wallet-connector-skeleton-${i}`}
          fullWidth
          size="lg"
          variant="ghost"
          className="!justify-between gap-3 !rounded-none"
        >
          <div className="flex flex-1 justify-between gap-3">
            <div className="flex gap-3">
              <SkeletonCircle radius={24} />
              <SkeletonText className="!w-32" />
            </div>
          </div>
        </Button>
      ))}
    </div>
  )
}
