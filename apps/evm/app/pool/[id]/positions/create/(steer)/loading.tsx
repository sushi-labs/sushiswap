import { SkeletonBox } from '@sushiswap/ui'
import React from 'react'

const PositionsCreateLoadingPage = () => {
  return (
    <div className="w-full flex justify-center">
      <SkeletonBox className="h-[763px] w-[400px]" />
    </div>
  )
}

export default PositionsCreateLoadingPage
