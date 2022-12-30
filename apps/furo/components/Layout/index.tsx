import { Backdrop, classNames, Container, MaxWidth } from '@sushiswap/ui'
import React from 'react'

type Props = {
  children?: React.ReactNode
  maxWidth?: MaxWidth
  backdrop?: React.ReactNode
  className?: string
}

export function Layout({ children, maxWidth = '5xl', backdrop, className }: Props) {
  return (
    <Container maxWidth={maxWidth} className={classNames(className, 'lg:mx-auto px-4 h-full pb-4 mb-40')}>
      <Backdrop backdrop={backdrop}>{children}</Backdrop>
    </Container>
  )
}
