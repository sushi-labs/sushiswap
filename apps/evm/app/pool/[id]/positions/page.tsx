import { ChainId } from '@sushiswap/chain'
import { ConcentratedPositionsTable } from 'ui/pool/PoolsSection/Tables/PositionsTable/ConcentratedPositionsTable'

import { PoolsFiltersProvider } from '../../../../ui/pool'
import { getPool } from '../page'

export default async function PositionsPage({ params }: { params: { id: string } }) {
  const [chainId, address] = params.id.split('%3A') as [ChainId, string]
  const pool = await getPool({ chainId, address })

  return (
    <PoolsFiltersProvider>
      <ConcentratedPositionsTable poolId={pool.address} />
    </PoolsFiltersProvider>
  )
}
