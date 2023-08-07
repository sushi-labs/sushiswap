import { isAddress } from '@ethersproject/address'
import { ChainId } from '@sushiswap/chain'
import { PoolTransactionsV2 } from 'ui/pool/PoolTransactionsV2'

import {
  PoolPositionProvider,
  PoolPositionRewardsProvider,
  PoolPositionStakedProvider,
  UnknownTokenAlert,
} from '../../../ui/pool'
import { PoolChartV2 } from '../../../ui/pool/PoolChartV2'
import { PoolComposition } from '../../../ui/pool/PoolComposition'
import { PoolMyRewards } from '../../../ui/pool/PoolMyRewards'
import { PoolPageV3 } from '../../../ui/pool/PoolPageV3'
import { PoolPosition } from '../../../ui/pool/PoolPosition'
import { PoolRewards } from '../../../ui/pool/PoolRewards'
import { PoolStats } from '../../../ui/pool/PoolStats'

export async function getPool({ chainId, address }: { chainId: ChainId; address: string }) {
  if (typeof +chainId !== 'number' || !isAddress(address)) {
    throw new Error(`The page you're looking for can't be found.`)
  }

  const data = await fetch(`https://pools.sushi.com/api/v0/${chainId}/${address}`).then((data) => data.json())
  if (!data) throw new Error(`The page you're looking for can't be found.`)

  return data
}

export default async function PoolPage({ params }: { params: { id: string } }) {
  const [chainId, address] = params.id.split('%3A') as [ChainId, string]
  const pool = await getPool({ chainId, address })

  if (pool.protocol === 'SUSHISWAP_V3') {
    return <PoolPageV3 pool={pool} />
  }

  return (
    <>
      <UnknownTokenAlert pool={pool} />
      <div className="grid grid-cols-1 md:grid-cols-[auto_400px] gap-6">
        <div className="flex flex-col gap-6">
          <PoolChartV2 address={pool.address} chainId={pool.chainId as ChainId} />
          <PoolStats pool={pool} />
        </div>
        <div className="flex flex-col gap-6">
          <PoolPositionProvider pool={pool}>
            <PoolPositionStakedProvider pool={pool}>
              <PoolPositionRewardsProvider pool={pool}>
                <PoolMyRewards pool={pool} />
                <PoolPosition pool={pool} />
              </PoolPositionRewardsProvider>
            </PoolPositionStakedProvider>
          </PoolPositionProvider>
          <PoolComposition pool={pool} />
          <PoolRewards pool={pool} />
        </div>
        <div className="col-span-1 md:col-span-2">
          <PoolTransactionsV2 pool={pool} poolId={pool.address} />
        </div>
      </div>
    </>
  )
}
