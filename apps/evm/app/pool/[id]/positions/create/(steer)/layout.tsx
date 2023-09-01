import { CardDescription, CardHeader, CardTitle, Container, LinkInternal } from '@sushiswap/ui'
import React from 'react'

export default async function Layout({ children, params }: { children: React.ReactNode; params: { id: string } }) {
  return (
    <>
      <Container maxWidth="5xl" className="px-2 sm:px-4">
        <CardHeader className="!px-0 text-center">
          <CardTitle>Smart Pools.</CardTitle>
          <CardDescription>A smartpool introduction blurb.</CardDescription>
        </CardHeader>
      </Container>
      <Container maxWidth="screen-3xl" className="px-2 sm:px-4">
        {children}
      </Container>
      <LinkInternal
        href={`/pool/${params.id}/positions/create/manual`}
        className="text-center text-blue hover:underline text-sm mt-4"
      >
        No thanks, I{`'`}ll manage the position myself.
      </LinkInternal>
    </>
  )
}
