import { Glow, Container } from '@sushiswap/ui'
import React from 'react'

export type LayoutProps = {
  children?: React.ReactNode
}

function Layout({ children }: LayoutProps) {
  return (
    <Container maxWidth="7xl" className="h-full mt-40 lg:mx-auto">
      <Glow>{children}</Glow>
    </Container>
  )
}

export default Layout
