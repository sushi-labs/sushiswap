import { SkeletonBox } from '@sushiswap/ui'
import React from 'react'

const PositionsCreateLoadingPage = () => {
  return (
    <div className="w-full flex justify-center gap-4">
      <SkeletonBox className="h-[662.3px] w-[400px]" />
      <SkeletonBox className="h-[662.3px] w-[400px]" />
      <SkeletonBox className="h-[662.3px] w-[400px]" />
    </div>
  )
}

export default PositionsCreateLoadingPage
