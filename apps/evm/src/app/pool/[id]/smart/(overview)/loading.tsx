import { Container, SkeletonBox } from '@sushiswap/ui'
import React from 'react'

const PositionsCreateLoadingPage = () => {
  return (
    <Container maxWidth="5xl" className="mx-auto pt-4">
      <SkeletonBox className="h-[651px] w-[400px]" />
      <SkeletonBox className="h-[651px] w-[400px]" />
      <SkeletonBox className="h-[651px] w-[400px]" />
    </Container>
  )
}

export default PositionsCreateLoadingPage
