import { ArrowDownIcon } from '@heroicons/react/20/solid'
import { ChainId } from '@sushiswap/chain'

import { PoolPositionProvider, PoolPositionRewardsProvider, PoolPositionStakedProvider } from '../../../../ui/pool'
import { RemoveSectionLegacy } from '../../../../ui/pool/RemoveSectionLegacy'
import { RemoveSectionTrident } from '../../../../ui/pool/RemoveSectionTrident'
import { RemoveSectionUnstake } from '../../../../ui/pool/RemoveSectionUnstake'
import { getPool } from '../page'

export default async function RemovePage({ params }: { params: { id: string; positionId?: string } }) {
  const [chainId, address] = params.id.split('%3A') as [ChainId, string]
  const pool = await getPool({ chainId, address })

  return (
    <PoolPositionProvider pool={pool}>
      <PoolPositionStakedProvider pool={pool}>
        <PoolPositionRewardsProvider pool={pool}>
          <div className="grid-cols-1 max-w-xl grid gap-4 pt-4">
            <RemoveSectionUnstake poolId={pool.id} />
            <div className="flex justify-center py-2">
              <ArrowDownIcon fill="currentColor" width={20} height={20} className="text-muted-foreground" />
            </div>
            {['BentoBox Classic', 'BentoBox Stable'].includes(pool.protocol) ? (
              <RemoveSectionTrident pool={pool} />
            ) : (
              <RemoveSectionLegacy pool={pool} />
            )}
          </div>
        </PoolPositionRewardsProvider>
      </PoolPositionStakedProvider>
    </PoolPositionProvider>
  )
}
