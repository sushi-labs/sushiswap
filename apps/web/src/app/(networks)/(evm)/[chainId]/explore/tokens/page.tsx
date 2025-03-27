import { Container } from '@sushiswap/ui'
import { notFound } from 'next/navigation'
import React from 'react'
import { TokensTable } from 'src/ui/token/TokensTable'
import { type SushiSwapChainId, isSushiSwapChainId } from 'sushi/config'

export default async function TokensPage(props: {
  params: Promise<{ chainId: string }>
}) {
  const params = await props.params
  const chainId = +params.chainId as SushiSwapChainId

  if (!isSushiSwapChainId(chainId)) {
    return notFound()
  }

  return (
    <Container maxWidth="7xl" className="px-4">
      <TokensTable chainId={chainId} />
    </Container>
  )
}
