import { ArrowDownIcon } from '@heroicons/react/20/solid'
import { ChainId } from '@sushiswap/chain'

import { PoolPositionProvider, PoolPositionRewardsProvider, PoolPositionStakedProvider } from '../../../../ui/pool'
import { AddSectionLegacy } from '../../../../ui/pool/AddSectionLegacy'
import { AddSectionStake } from '../../../../ui/pool/AddSectionStake'
import { AddSectionTrident } from '../../../../ui/pool/AddSectionTrident'
import { getPool } from '../page'

export default async function AddPage({ params }: { params: { id: string; positionId?: string } }) {
  const [chainId, address] = params.id.split('%3A') as [ChainId, string]
  const pool = await getPool({ chainId, address })

  return (
    <PoolPositionProvider pool={pool}>
      <PoolPositionStakedProvider pool={pool}>
        <PoolPositionRewardsProvider pool={pool}>
          <div className="grid-cols-1 max-w-xl grid gap-4 pt-4">
            {['BentoBox Classic', 'BentoBox Stable'].includes(pool.protocol) ? (
              <AddSectionTrident pool={pool} />
            ) : (
              <AddSectionLegacy pool={pool} />
            )}
            <div className="flex justify-center py-2">
              <ArrowDownIcon width={20} height={20} />
            </div>
            <AddSectionStake poolId={pool.id} />
          </div>
        </PoolPositionRewardsProvider>
      </PoolPositionStakedProvider>
    </PoolPositionProvider>
  )
}
