import { isPoolChainId } from '@sushiswap/graph-client/data-api'
import { Container } from '@sushiswap/ui'
import { notFound } from 'next/navigation'
import React from 'react'
import { TableFiltersSearchToken } from 'src/app/(networks)/_ui/table-filters-search-token'
import { PoolsTableV2 } from '~evm/[chainId]/_ui/PoolsTableV2'
import { TableFiltersAPR } from '~evm/[chainId]/_ui/TableFiltersAPR'
import { TableFiltersNetworkV2 } from '~evm/[chainId]/_ui/TableFiltersNetworkV2'
import { TableFiltersPoolTypeV2 } from '~evm/[chainId]/_ui/TableFiltersPoolTypeV2'
import { TableFiltersTVL } from '~evm/[chainId]/_ui/TableFiltersTVL'
import { TableFiltersFarmsOnly } from '~evm/[chainId]/_ui/table-filters-farms-only'

export default async function PoolsPage(props: {
  params: Promise<{ chainId: string }>
}) {
  const params = await props.params
  const chainId = +params.chainId

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
          <TableFiltersFarmsOnly />
          <TableFiltersTVL />
          <TableFiltersAPR />

          <TableFiltersNetworkV2 />
        </div>
      </div>
      <PoolsTableV2 chainId={chainId} />
    </Container>
  )
}
