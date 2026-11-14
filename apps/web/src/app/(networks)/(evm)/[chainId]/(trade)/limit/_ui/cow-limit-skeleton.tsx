'use client'

import { Container, SkeletonBox } from '@sushiswap/ui'
import { SimpleSwapWidgetFrame } from '../../swap/_ui/simple-swap-widget-frame'
import { SimpleSwapInputsSkeleton } from '../../swap/_ui/simple-swap-widget-skeleton'
import { CowLimitColumns } from './cow-limit-columns'

// The limit page's loading shell, shaped like the real form and orders panel.
export function CowLimitSkeleton(): React.JSX.Element {
  return (
    <Container maxWidth="6xl" className="relative">
      <CowLimitColumns
        form={
          <SimpleSwapWidgetFrame mode="limit">
            <SimpleSwapInputsSkeleton label="Minimum receive" />
            <SkeletonBox className="w-full h-[132px] rounded-xl" />
            <div className="flex items-center justify-between gap-2 px-1">
              <span className="text-sm text-muted-foreground">Expires in</span>
              <SkeletonBox className="w-[270px] h-10 rounded-lg" />
            </div>
            <SkeletonBox className="w-full h-[52px] rounded-xl mb-2" />
          </SimpleSwapWidgetFrame>
        }
        orders={
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2 px-1">
              <span className="text-sm font-medium">Your orders</span>
              <SkeletonBox className="w-[134px] h-10 rounded-lg" />
            </div>
            <SkeletonBox className="w-full h-[54px] rounded-xl" />
          </div>
        }
      />
    </Container>
  )
}
