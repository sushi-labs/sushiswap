import { Container } from '@sushiswap/ui'
import React from 'react'

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Container maxWidth="5xl" className="py-10 px-4">
      {children}
    </Container>
  )
}
