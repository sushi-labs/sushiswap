'use client'

import { Container as SushiContainer } from '@sushiswap/ui/components/Container'
import React, { ComponentProps } from 'react'

export function Container({ children, maxWidth = '6xl', className }: ComponentProps<typeof SushiContainer>) {
  return (
    <SushiContainer maxWidth={maxWidth} className={className}>
      {children}
    </SushiContainer>
  )
}
