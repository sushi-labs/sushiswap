import { AppearOnMount, Typography, useBreakpoint } from '@sushiswap/ui'
import { FC, Fragment, useState } from 'react'

import { PairWithAlias } from '../../../types'
import { PoolActionBarPositionDialog } from './PoolActionBarPositionDialog'
import { PoolActionBarPositionRewards } from './PoolActionBarPositionRewards'
import { usePoolFarmRewards } from '../../PoolFarmRewardsProvider'

interface PoolActionBarProps {
  pair: PairWithAlias
}

export const PoolActionBar: FC<PoolActionBarProps> = ({ pair }) => {
  const [openPosition, setOpenPosition] = useState<boolean>(false)
  const [openRewards, setOpenRewards] = useState<boolean>(false)
  const { isFarm } = usePoolFarmRewards(pair)
  const { isLg } = useBreakpoint('lg')

  if (isLg) return <></>

  return (
    <AppearOnMount as={Fragment}>
      <div className="fixed bottom-6 right-0 left-0 flex justify-center">
        <div>
          <div className="rounded-full shadow-black/50 bg-blue shadow-md divide-x divide-slate-800">
            <button onClick={() => setOpenPosition(true)} className="inline-flex cursor-pointer px-4 py-3">
              <Typography variant="sm" weight={600} className="text-slate-50">
                My Position
              </Typography>
            </button>
            {isFarm && (
              <button onClick={() => setOpenRewards(true)} className="inline-flex cursor-pointer px-4 py-3">
                <Typography variant="sm" weight={600} className="text-slate-50">
                  My Rewards
                </Typography>
              </button>
            )}
          </div>
        </div>
        <PoolActionBarPositionDialog pair={pair} open={openPosition} setOpen={setOpenPosition} />
        {isFarm && <PoolActionBarPositionRewards pair={pair} open={openRewards} setOpen={setOpenRewards} />}
      </div>
    </AppearOnMount>
  )
}
