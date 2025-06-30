import { Container, SkeletonBox } from '@sushiswap/ui'
import React from 'react'
import { OrbsBanner } from 'src/ui/swap/twap/orbs-banner'

export default function SwapLimitLoading() {
  return (
    <Container maxWidth="lg">
      <div className="flex flex-col gap-4 p-4 md:p-6 bg-[rgba(255,255,255,0.8)] dark:bg-[rgba(25,32,49,0.8)] rounded-3xl backdrop-blur-2xl">
        <div className="flex gap-2">
          <SkeletonBox className="shrink-0 h-[36px] w-[61px] rounded-xl" />
          <SkeletonBox className="shrink-0 h-[36px] w-[56px] rounded-xl" />
          <SkeletonBox className="shrink-0 h-[36px] w-[54px] rounded-xl" />
          <SkeletonBox className="shrink-0 h-[36px] w-[136px] rounded-xl" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <SkeletonBox className="w-full h-[157px] rounded-xl" />
            <div className="flex flex-col gap-[10px]">
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
        <OrbsBanner />
      </div>
    </Container>
  )
}
