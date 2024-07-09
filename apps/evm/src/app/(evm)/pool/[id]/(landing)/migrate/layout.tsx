import { Container } from '@sushiswap/ui'
import React from 'react'

export default async function Layout({
  children,
}: { children: React.ReactNode; params: { id: string } }) {
  return (
    <>
      <Container maxWidth="screen-lg" className="px-2 sm:px-4">
        {children}
      </Container>
    </>
  )
}
