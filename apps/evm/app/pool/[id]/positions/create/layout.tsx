import React from '@sushiswap/prettier-config/dist/react'
import { CardDescription, CardHeader, CardTitle, Container, LinkInternal, Separator } from '@sushiswap/ui'
import { SteerPoolCards } from 'ui/pool/SteerPoolCards'

export default async function Layout({ children, params }: { children: React.ReactNode; params: { id: string } }) {
  return (
    <section className="flex flex-col flex-1 mt-4">
      <div className="bg-gray-50 dark:bg-white/[0.02] border-t border-accent pt-10 pb-20 h-full">
        <div className="flex flex-col gap-4">
          <Container maxWidth="5xl" className="px-2 sm:px-4">
            <LinkInternal href={`/pool/${params.id}`} className="text-blue hover:underline text-sm">
              ← Back
            </LinkInternal>
          </Container>
          <Container maxWidth="5xl" className="px-2 sm:px-4">
            <CardHeader className="!px-0 text-center">
              <CardTitle>Smart Pools.</CardTitle>
              <CardDescription>A smartpool introduction blurb.</CardDescription>
            </CardHeader>
          </Container>
          <Container maxWidth="screen-3xl" className="px-2 sm:px-4">
            <SteerPoolCards />
          </Container>
          <LinkInternal
            href={`/pool/${params.id}/positions/create/manual`}
            className="text-center text-blue hover:underline text-sm mt-4"
          >
            No thanks, i{`'`}ll manage the position myself.
          </LinkInternal>
          <div className="py-6">
            <Separator />
          </div>
        </div>
      </div>
    </section>
  )
}
