'use client'

import Container from '@sushiswap/ui/future/components/Container'
import React from 'react'

export default async function SwapPage() {
  // simulating to force loading segment...
  await new Promise((resolve) => setTimeout(resolve, 3000))
  return (
    <Container maxWidth={520} className="p-4 mx-auto mt-16 mb-[86px] flex flex-col gap-4">
      <h1>SushiSwap 🍣</h1>
      {/*spacer for fixed positioned swap button */}
      <div className="h-[68px] w-full" />
    </Container>
  )
}
