import { Container, SkeletonBox } from '@sushiswap/ui'
import React from 'react'

export default function SwapLimitLoading() {
  return (
    <Container maxWidth="lg" className="px-4">
      <div className="flex flex-col gap-4">
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
          <div className="flex flex-col gap-2">
            <SkeletonBox className="w-full h-[157px] rounded-xl" />
            <div className="flex flex-col gap-[9px]">
              <SkeletonBox className="w-full h-[142px] rounded-xl" />
              <SkeletonBox className="w-full h-[142px] rounded-xl" />
            </div>
          </div>
          <div className="flex justify-end gap-2 py-1">
            <SkeletonBox className="w-[69px] h-[28px] rounded-xl" />
            <SkeletonBox className="w-[80px] h-[28px] rounded-xl" />
            <SkeletonBox className="w-[87px] h-[28px] rounded-xl" />
            <SkeletonBox className="w-[73px] h-[28px] rounded-xl" />
          </div>
        </div>
        <SkeletonBox className="w-full h-[52px] rounded-xl" />
        <SkeletonBox className="w-full h-[52px] rounded-xl" />
      </div>
    </Container>
  )
}
