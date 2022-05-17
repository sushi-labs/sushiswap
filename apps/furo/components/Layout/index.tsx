import { Container, Glow, MaxWidth } from '@sushiswap/ui'
import React from 'react'

type Props = {
  children?: React.ReactNode
  maxWidth?: MaxWidth
  gradient?: boolean
  backdrop?: React.ReactNode
}

function Layout({ children, maxWidth = '5xl', gradient = false, backdrop }: Props) {
  if (!gradient) {
    return (
      <Container maxWidth={maxWidth} className="lg:mx-auto px-4 h-full">
        {children}
      </Container>
    )
  }

  return (
    <Container maxWidth={maxWidth} className="lg:mx-auto px-4 h-full">
      <Glow className="bg-noise" backdrop={backdrop}>
        {children}
      </Glow>
    </Container>
  )
}

export default Layout
