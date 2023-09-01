import { Container, LinkInternal } from '@sushiswap/ui'
import React from 'react'

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
          {children}
        </div>
      </div>
    </section>
  )
}
