import { Container, SkeletonBox } from '@sushiswap/ui'
import React from 'react'

export default function SimpleSwapLoading() {
  return (
    <Container maxWidth="lg" className="px-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 mb-4 sm:mt-10 mt-2">
          <SkeletonBox className="w-[140px] h-[53px]" />
          <SkeletonBox className="h-[20px] w-[280px]" />
        </div>
        <div className="flex gap-2">
          <SkeletonBox className="h-[36px] w-[125px]" />
          <SkeletonBox className="h-[36px] w-[125px]" />
        </div>
        <SkeletonBox className="w-full h-[92px]" />
        <SkeletonBox className="w-full h-[110px]" />
        <SkeletonBox className="w-full h-[110px]" />
        <SkeletonBox className="w-full h-[52px]" />
      </div>
    </Container>
  )
}
