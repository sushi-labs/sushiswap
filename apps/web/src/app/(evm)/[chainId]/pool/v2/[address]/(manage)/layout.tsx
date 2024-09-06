import { Container, LinkInternal } from '@sushiswap/ui'
import React from 'react'
import { ChainId, ChainKey } from 'sushi/chain'

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { chainId: string; address: string }
}) {
  const { chainId: _chainId, address } = params
  const chainId = +_chainId as ChainId

  return (
    <Container maxWidth="5xl" className="py-10 px-4">
      <div className="flex flex-col gap-4">
        <LinkInternal
          href={`/${ChainKey[chainId]}/pool/v2/${address}`}
          className="text-blue hover:underline text-sm"
        >
          ← Pool
        </LinkInternal>
        {children}
      </div>
    </Container>
  )
}
