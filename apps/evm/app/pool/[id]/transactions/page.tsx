import { ChainId } from '@sushiswap/chain'

import { PoolTransactionsV2 } from '../../../../ui/pool/PoolTransactionsV2'
import { PoolTransactionsV3 } from '../../../../ui/pool/PoolTransactionsV3'
import { getPool } from '../page'

export default async function TransactionsPage({ params }: { params: { id: string; positionId?: string } }) {
  const [chainId, address] = params.id.split('%3A') as [ChainId, string]
  const pool = await getPool({ chainId, address })

  if (pool.protocol === 'SUSHISWAP_V3') {
    return <PoolTransactionsV3 pool={pool} poolId={pool.address} />
  }

  return <PoolTransactionsV2 pool={pool} poolId={pool.address} />
}
