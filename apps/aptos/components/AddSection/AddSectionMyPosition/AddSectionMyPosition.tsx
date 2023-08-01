import { Typography, classNames } from '@sushiswap/ui'
import { FC } from 'react'
import { AddSectionMyPositionUnstaked } from './AddSectionMyPositionUnstaked'
import { AddSectionMyPositionStaked } from './AddSectionMyPositionStaked'
import { Token } from 'utils/tokenType'

interface Props {
  balance: number
  underlying0: number | undefined
  underlying1: number | undefined
  token0: Token
  token1: Token
}

export const AddSectionMyPosition: FC<Props> = ({ balance, underlying0, underlying1, token0, token1 }) => {
  return (
    <div className="flex flex-col bg-white dark:bg-opacity-[0.04] rounded-2xl">
      <div className="flex flex-col gap-4 p-5">
        <div className="grid items-center grid-cols-2 gap-2">
          <Typography variant="xs" weight={500} className="text-gray-700 dark:text-slate-300">
            Total APR:
          </Typography>
          <Typography variant="xs" weight={500} className="text-right text-gray-700 dark:text-slate-300">
            0.00%
          </Typography>
          <Typography variant="xs" weight={500} className="text-gray-700 dark:text-slate-300">
            Fee APR:
          </Typography>
          <Typography variant="xs" weight={500} className="text-right text-gray-700 dark:text-slate-300">
            0.00%
          </Typography>
          <Typography variant="xs" weight={500} className="text-gray-700 dark:text-slate-300">
            Reward APR:
          </Typography>
          <Typography variant="xs" weight={500} className="text-right text-gray-700 dark:text-slate-300">
            0.00%
          </Typography>
          <Typography variant="xs" weight={500} className="text-gray-700 dark:text-slate-300">
            Farming Rewards:
          </Typography>
          <div className={classNames()}></div>
        </div>
      </div>
      <div className="px-5">
        <hr className="h-px border-t dark:border-slate-200/5 border-gray-900/5" />
      </div>
      <div className="p-5 space-y-5">
        <AddSectionMyPositionUnstaked
          balance={balance}
          underlying0={underlying0}
          underlying1={underlying1}
          token0={token0}
          token1={token1}
        />
        <AddSectionMyPositionStaked />
      </div>
    </div>
  )
}
