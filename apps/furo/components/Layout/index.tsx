import { Glow, Container } from '@sushiswap/ui'
import React from 'react'

type Props = {
  children?: React.ReactNode
}

function Layout({ children }: Props) {
  return (
    <Container maxWidth="5xl" className="lg:mx-auto px-2 h-full mt-40">
      <Glow>{children}</Glow>
    </Container>
  )
}

export default Layout
