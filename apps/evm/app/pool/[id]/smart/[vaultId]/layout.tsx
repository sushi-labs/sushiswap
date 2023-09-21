import { Container, LinkInternal } from '@sushiswap/ui'
import React from 'react'

export default async function Layout({ children, params }: { children: React.ReactNode; params: { id: string } }) {
  return (
    <div className="flex flex-col gap-4">
      <Container maxWidth="5xl" className="px-2 sm:px-4">
        <LinkInternal href={`/pool/${params.id}/smart`} className="text-blue hover:underline text-sm">
          ← Strategies
        </LinkInternal>
      </Container>
      <Container maxWidth="screen-3xl" className="px-2 sm:px-4">
        {children}
      </Container>
    </div>
  )
}
