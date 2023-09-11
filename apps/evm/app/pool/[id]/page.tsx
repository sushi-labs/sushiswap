import { ChainId } from '@sushiswap/chain'
import { Container, Separator } from '@sushiswap/ui'
import { ManageV2LiquidityCard } from 'ui/pool/ManageV2LiquidityCard'
import { PoolTransactionsV2 } from 'ui/pool/PoolTransactionsV2'
import { isAddress } from 'viem'

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

export default async function PoolPage({
  params,
  tab = 'add',
}: {
  params: { id: string }
  tab: 'add' | 'remove' | 'unstake' | 'stake'
}) {
  const [_chainId, address] = params.id.split(params.id.includes('%3A') ? '%3A' : ':') as [string, string]
  const chainId = Number(_chainId) as ChainId
  const pool = await getPool({ chainId, address })

  if (pool.protocol === 'SUSHISWAP_V3') {
    return <PoolPageV3 pool={pool} />
  }

  return (
    <Container maxWidth="5xl" className="px-2 sm:px-4">
      <UnknownTokenAlert pool={pool} />
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-[auto_400px] gap-6">
          <ManageV2LiquidityCard pool={pool} tab={tab} />
          <div className="flex flex-col gap-6">
            <PoolPositionProvider pool={pool}>
              <PoolPositionStakedProvider pool={pool}>
                <PoolPositionRewardsProvider pool={pool}>
                  <PoolPosition pool={pool} />
                  <PoolMyRewards pool={pool} />
                </PoolPositionRewardsProvider>
              </PoolPositionStakedProvider>
            </PoolPositionProvider>
          </div>
        </div>
        <div className="py-4">
          <Separator />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[auto_400px] gap-6">
          <PoolChartV2 address={pool.address} chainId={pool.chainId as ChainId} />
          <div className="flex flex-col gap-6">
            <PoolComposition pool={pool} />
            <PoolStats pool={pool} />
            <PoolRewards pool={pool} />
          </div>
        </div>
        <div className="py-4">
          <Separator />
        </div>
        <PoolTransactionsV2 pool={pool} poolId={pool.address} />
      </div>
    </Container>
  )
}
