import {
  CardDescription,
  CardHeader,
  CardTitle,
  Container,
  LinkInternal,
} from '@sushiswap/ui'
import React from 'react'
import { ChainId, ChainKey } from 'sushi/chain'

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { chainId: string; address: string }
}) {
  const { chainId: _chainId, address } = params
  const chainId = +_chainId as ChainId
  return (
    <div>
      <Container maxWidth="5xl" className="py-10 px-4 flex flex-col gap-4">
        <LinkInternal
          href={`/${ChainKey[chainId]}/pool/v3/${address}`}
          className="text-blue hover:underline text-sm"
        >
          ← Pool details
        </LinkInternal>
        <CardHeader className="!p-0">
          <CardTitle>Available Strategies</CardTitle>
          <CardDescription>
            Choose one of the following strategies:
          </CardDescription>
        </CardHeader>
      </Container>
      {children}
    </div>
  )
}
