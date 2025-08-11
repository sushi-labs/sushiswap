import { Container, SkeletonBox } from '@sushiswap/ui'
import React from 'react'

export default function CrossChainSwapLoading() {
  return (
    <Container maxWidth="lg">
      <div className="flex flex-col gap-4 p-4 md:p-6 bg-[rgba(255,255,255,0.8)] dark:bg-[rgba(25,32,49,0.8)] rounded-3xl backdrop-blur-2xl">
        <div className="flex gap-2">
          <SkeletonBox className="h-[36px] w-[61px] rounded-xl" />
          <SkeletonBox className="h-[36px] w-[56px] rounded-xl" />
          <SkeletonBox className="h-[36px] w-[54px] rounded-xl" />
          <SkeletonBox className="h-[36px] w-[136px] rounded-xl" />
        </div>
        <div className="flex flex-col gap-[10px]">
          <SkeletonBox className="w-full h-[142px] rounded-xl" />
          <SkeletonBox className="w-full h-[142px] rounded-xl" />
        </div>
        <SkeletonBox className="w-full h-[52px] rounded-xl" />
      </div>
    </Container>
  )
}
