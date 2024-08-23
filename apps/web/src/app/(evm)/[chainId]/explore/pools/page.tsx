import { getTopPools } from '@sushiswap/graph-client/data-api'
import { Container } from '@sushiswap/ui'
import { unstable_cache } from 'next/cache'
import React, { FC, Suspense } from 'react'
import { PoolsTable } from 'src/ui/pool/PoolsTable'
import { TableFiltersSmartPoolsOnly } from 'src/ui/pool/TableFilterSmartPoolsOnly'
import { TableFiltersFarmsOnly } from 'src/ui/pool/TableFiltersFarmsOnly'
import { TableFiltersNetwork } from 'src/ui/pool/TableFiltersNetwork'
import { TableFiltersPoolType } from 'src/ui/pool/TableFiltersPoolType'
import { TableFiltersResetButton } from 'src/ui/pool/TableFiltersResetButton'
import { TableFiltersSearchToken } from 'src/ui/pool/TableFiltersSearchToken'
import { ChainId } from 'sushi/chain'

const _PoolsTable: FC<{ chainId: ChainId }> = async ({ chainId }) => {
  const pools = await unstable_cache(
    async () => getTopPools({ chainId: `${chainId}` }),
    ['pools', `${chainId}`],
    {
      revalidate: 60 * 15,
    },
  )()

  return <PoolsTable chainId={chainId} pools={pools} />
}

export default async function PoolsPage({
  params,
}: {
  params: { chainId: string }
}) {
  const chainId = +params.chainId as ChainId
  return (
    <Container maxWidth="7xl" className="px-4">
      <div className="flex flex-wrap gap-3 mb-4">
        <TableFiltersSearchToken />
        <TableFiltersPoolType />
        <TableFiltersNetwork chainId={chainId} />
        <TableFiltersFarmsOnly />
        <TableFiltersSmartPoolsOnly />
        <TableFiltersResetButton />
      </div>
      <Suspense fallback={<PoolsTable chainId={chainId} isLoading={true} />}>
        <_PoolsTable chainId={chainId} />
      </Suspense>
    </Container>
  )
}
