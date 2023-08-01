import { ChainId } from '@sushiswap/chain'

import { PoolTransactionsV2 } from '../../../../ui/pool'
import { getPool } from '../page'

export default async function TransactionsPage({ params }: { params: { id: string; positionId?: string } }) {
  const [chainId, address] = params.id.split('%3A') as [ChainId, string]
  const pool = await getPool({ chainId, address })

  return <PoolTransactionsV2 pool={pool} poolId={pool.address} />
}
