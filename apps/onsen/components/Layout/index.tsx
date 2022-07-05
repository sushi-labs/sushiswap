import { Backdrop, classNames, Container, MaxWidth } from '@sushiswap/ui'
import React from 'react'

type Props = {
  children?: React.ReactNode
  maxWidth?: MaxWidth
  className?: string
}

function Layout({ children, className, maxWidth = '5xl' }: Props) {
  return (
    <Container maxWidth={maxWidth} className={classNames(className, 'lg:mx-auto px-4 h-full pb-4 mb-40')}>
      <Backdrop>{children}</Backdrop>
    </Container>
  )
}

export default Layout
