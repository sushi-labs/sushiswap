import { Container, LinkInternal } from '@sushiswap/ui'
import React from 'react'
import { ChainId, ChainKey } from 'sushi/chain'

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { chainId: string }
}) {
  const chainId = +params.chainId as ChainId

  return (
    <Container maxWidth="5xl" className="py-10 px-4">
      <div className="flex flex-col gap-4">
        <LinkInternal
          href={`/${ChainKey[chainId]}/migrate`}
          className="text-blue hover:underline text-sm"
        >
          ← Back
        </LinkInternal>
        {children}
      </div>
    </Container>
  )
}
