import { Container } from '@sushiswap/ui'
import { notFound } from 'next/navigation'
import React from 'react'
import { TableFiltersSearchToken } from 'src/ui/token/TableFiltersSearchToken'
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
      <div className="flex flex-wrap gap-3 mb-4">
        <TableFiltersSearchToken />
      </div>
      <TokensTable chainId={chainId} />
    </Container>
  )
}
