import { Glow, Container, Typography, classNames } from '@sushiswap/ui'
import React from 'react'

export type LayoutProps = {
  children?: React.ReactNode
  className?: string
}

function Layout({ children, className }: LayoutProps) {
  return (
    <Container maxWidth="7xl" className={classNames('h-full mt-40 lg:mx-auto', className)}>
      {children}
    </Container>
  )
}

export default Layout
