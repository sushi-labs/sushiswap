import { Container, LinkInternal } from '@sushiswap/ui'
import React from 'react'

export default async function Layout({ children, params }: { children: React.ReactNode; params: { id: string } }) {
  return (
    <div className="flex flex-col gap-4">
      <Container maxWidth="5xl" className="px-2 sm:px-4">
        <LinkInternal href={`/pool/${params.id}`} className="text-blue hover:underline text-sm">
          ← Back
        </LinkInternal>
      </Container>
      {children}
    </div>
  )
}
