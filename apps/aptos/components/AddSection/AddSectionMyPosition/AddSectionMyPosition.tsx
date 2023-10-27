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
  farmUnderlying0: number | undefined
  farmUnderlying1: number | undefined
  isLoading:boolean
}

export const AddSectionMyPosition: FC<Props> = ({
  balance,
  underlying0,
  underlying1,
  token0,
  token1,
  farmUnderlying0,
  farmUnderlying1,
  isLoading
}) => {
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
          <div className="flex justify-end">
            <img
              src="https://cdn.sushi.com/image/upload/f_auto,c_limit,w_64,q_auto/tokens/137/0x0b3F868E0BE5597D5DB7fEB59E1CADBb0fdDa50a.jpg"
              className="rounded-full"
              height={16}
              width={16}
              alt=""
            />
          </div>
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
          isLoading={isLoading}
        />
        <AddSectionMyPositionStaked
          balance={balance}
          underlying0={farmUnderlying0}
          underlying1={farmUnderlying1}
          token0={token0}
          token1={token1}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
