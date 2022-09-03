import { Typography } from '@sushiswap/ui'
import { FC, useState } from 'react'

import { PairWithAlias } from '../../../types'
import { PoolActionBarPositionDialog } from './PoolActionBarPositionDialog'
import { PoolActionBarPositionRewards } from './PoolActionBarPositionRewards'

interface PoolActionBarProps {
  pair: PairWithAlias
}

export const PoolActionBar: FC<PoolActionBarProps> = ({ pair }) => {
  const [openPosition, setOpenPosition] = useState<boolean>(false)
  const [openRewards, setOpenRewards] = useState<boolean>(false)

  return (
    <>
      <div className="fixed bottom-6 right-0 left-0 flex justify-center">
        <div className="rounded-full shadow-black/50 bg-blue shadow-md divide-x divide-slate-800">
          <button onClick={() => setOpenPosition(true)} className="inline-flex cursor-pointer px-4 py-3">
            <Typography variant="sm" weight={600} className="text-slate-50">
              My Position
            </Typography>
          </button>
          <button onClick={() => setOpenRewards(true)} className="inline-flex cursor-pointer px-4 py-3">
            <Typography variant="sm" weight={600} className="text-slate-50">
              My Rewards
            </Typography>
          </button>
        </div>
      </div>
      <PoolActionBarPositionDialog pair={pair} open={openPosition} setOpen={setOpenPosition} />
      <PoolActionBarPositionRewards pair={pair} open={openRewards} setOpen={setOpenRewards} />
    </>
  )
}
