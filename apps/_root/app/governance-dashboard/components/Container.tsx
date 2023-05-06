'use client'

import React, { ComponentProps } from 'react'
import { Container as SushiContainer } from '@sushiswap/ui/future/components/Container'

export function Container({ children, maxWidth = '6xl', className }: ComponentProps<typeof SushiContainer>) {
  return (
    <SushiContainer maxWidth={maxWidth} className={className}>
      {children}
    </SushiContainer>
  )
}
