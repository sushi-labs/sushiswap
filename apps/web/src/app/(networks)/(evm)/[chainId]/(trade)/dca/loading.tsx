import { Container, SkeletonBox } from '@sushiswap/ui'
import React from 'react'

export default function SwapDCALoading() {
  return (
    <Container maxWidth="lg" className="px-4">
      <div className="flex flex-col gap-4 p-6 pt-0 pb-16 bg-[rgba(255,255,255,0.8)] dark:bg-[rgba(15,23,42,0.8)] rounded-3xl">
        <div className="flex flex-col gap-2 mb-4 sm:mt-10 mt-2">
          <SkeletonBox className="h-[36px] w-[140px] md:h-[53px] rounded-xl" />
          <SkeletonBox className="h-[20px] w-[280px] rounded-xl" />
        </div>
        <div className="flex gap-2">
          <SkeletonBox className="shrink-0 h-[36px] w-[61px] rounded-xl" />
          <SkeletonBox className="shrink-0 h-[36px] w-[56px] rounded-xl" />
          <SkeletonBox className="shrink-0 h-[36px] w-[54px] rounded-xl" />
          <SkeletonBox className="shrink-0 h-[36px] w-[136px] rounded-xl" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-[9px]">
            <SkeletonBox className="w-full h-[142px] rounded-xl" />
            <SkeletonBox className="w-full h-[102px] rounded-xl" />
          </div>
          <div className="flex flex-wrap gap-3 py-6 mb-1">
            <SkeletonBox className="flex-1 w-full h-[54px] rounded-xl" />
            <SkeletonBox className="flex-1 w-full h-[54px] rounded-xl" />
          </div>
          <SkeletonBox className="w-full h-[52px] rounded-xl" />
        </div>
        <SkeletonBox className="w-full h-[52px] rounded-xl" />
      </div>
    </Container>
  )
}
