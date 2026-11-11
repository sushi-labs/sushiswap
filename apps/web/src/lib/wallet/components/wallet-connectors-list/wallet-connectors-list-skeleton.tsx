'use client'

import { Button, SkeletonText } from '@sushiswap/ui'
import { SkeletonBox } from '@sushiswap/ui'

export function WalletConnectorsListSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading wallets"
      className="overflow-hidden rounded-2xl bg-secondary divide-y-2 divide-background"
    >
      {Array.from(new Array(5)).map((_, i) => (
        <Button
          key={`wallet-connector-skeleton-${i}`}
          disabled
          aria-hidden
          fullWidth
          size="lg"
          variant="ghost"
          className="!h-auto !min-h-[74px] !justify-between gap-3 !rounded-none !px-4 !py-4"
        >
          <div className="flex flex-1 justify-between gap-3">
            <div className="flex items-center gap-4">
              <SkeletonBox className="h-10 w-10 shrink-0 !rounded-lg" />
              <SkeletonText className="!w-32" />
            </div>
          </div>
        </Button>
      ))}
    </div>
  )
}
