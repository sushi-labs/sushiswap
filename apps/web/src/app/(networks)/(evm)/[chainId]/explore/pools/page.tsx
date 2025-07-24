import { isPoolChainId } from '@sushiswap/graph-client/data-api'
import { Container } from '@sushiswap/ui'
import { notFound } from 'next/navigation'
import React from 'react'
import { PoolsTableV2 } from 'src/ui/pool/PoolsTableV2'
import { TableFiltersAPR } from 'src/ui/pool/TableFiltersAPR'
import { TableFiltersNetworkV2 } from 'src/ui/pool/TableFiltersNetworkV2'
import { TableFiltersPoolTypeV2 } from 'src/ui/pool/TableFiltersPoolTypeV2'
import { TableFiltersSearchToken } from 'src/ui/pool/TableFiltersSearchToken'
import { TableFiltersTVL } from 'src/ui/pool/TableFiltersTVL'
import type { ChainId } from 'sushi/chain'

export default async function PoolsPage(props: {
  params: Promise<{ chainId: string }>
}) {
  const params = await props.params
  const chainId = +params.chainId as ChainId

  if (!isPoolChainId(chainId)) {
    return notFound()
  }

  return (
    <Container maxWidth="7xl" className="px-4 max-w-[1696px]">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h3 className="font-[600] md:text-lg text-slate-900 dark:text-pink-100">
          All Pools
        </h3>
        <div className="flex gap-3 flex-wrap">
          <TableFiltersSearchToken />
          <TableFiltersPoolTypeV2 />
          <TableFiltersTVL />
          <TableFiltersAPR />
          <TableFiltersNetworkV2 />
        </div>
      </div>
      <PoolsTableV2 chainId={chainId} />
    </Container>
  )
}
