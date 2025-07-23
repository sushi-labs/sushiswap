import { isPoolChainId } from '@sushiswap/graph-client/data-api'
import { Container } from '@sushiswap/ui'
import { notFound } from 'next/navigation'
import React from 'react'
import { POOL_SUPPORTED_NETWORKS } from 'src/config'
import { PoolsTableV2 } from 'src/ui/pool/PoolsTableV2'
import { TableFiltersFarmsOnly } from 'src/ui/pool/TableFiltersFarmsOnly'
import { TableFiltersNetwork } from 'src/ui/pool/TableFiltersNetwork'
import { TableFiltersPoolType } from 'src/ui/pool/TableFiltersPoolType'
import { TableFiltersResetButton } from 'src/ui/pool/TableFiltersResetButton'
import { TableFiltersSearchToken } from 'src/ui/pool/TableFiltersSearchToken'
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
          <TableFiltersPoolType />
          <TableFiltersNetwork
            network={chainId}
            supportedNetworks={POOL_SUPPORTED_NETWORKS}
            unsupportedNetworkHref="/ethereum/explore/pools"
          />
          <TableFiltersFarmsOnly />
          <TableFiltersResetButton />
        </div>
      </div>
      <PoolsTableV2 chainId={chainId} />
    </Container>
  )
}
