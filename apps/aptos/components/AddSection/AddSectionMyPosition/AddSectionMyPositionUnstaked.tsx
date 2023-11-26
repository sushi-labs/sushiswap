import { formatPercent } from '@sushiswap/format'
import { Typography } from '@sushiswap/ui'
import { Icon } from 'components/Icon'
import { FC } from 'react'
import { Token } from 'utils/tokenType'

interface Props {
  balance: number
  totalBalance: number
  underlying0: string | undefined
  underlying1: string | undefined
  token0: Token
  token1: Token
  isLoading: boolean
}

export const AddSectionMyPositionUnstaked: FC<Props> = ({
  balance,
  totalBalance,
  underlying0,
  underlying1,
  token0,
  token1,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex gap-1 justify-between items-center">
          <Typography variant="sm" weight={600} className="dark:text-slate-50 text-gray-900">
            My Liquidity Position
          </Typography>
          <div className="h-[16px] w-[40px] animate-pulse bg-slate-600 rounded-full" />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center gap-1.5">
            <div className="h-[16px] w-[120px] bg-slate-700 animate-pulse rounded-full" />
            <div className="h-[16px] w-[40px] bg-slate-700 animate-pulse rounded-full" />
          </div>
          <div className="flex justify-between items-center gap-1.5">
            <div className="h-[16px] w-[120px] bg-slate-700 animate-pulse rounded-full" />
            <div className="h-[16px] w-[40px] bg-slate-700 animate-pulse rounded-full" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1 justify-between items-center">
        <Typography variant="sm" weight={600} className="dark:text-slate-50 text-gray-900">
          My Liquidity Position
        </Typography>
        <Typography variant="xs" weight={500} className="dark:text-slate-400 text-gray-600">
          {totalBalance ? formatPercent(balance / totalBalance) : '0.00%'}
        </Typography>
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4">{token0 && <Icon currency={token0} width={16} height={16} />}</div>
          <Typography variant="xs" weight={500} className="flex items-center gap-1 dark:text-slate-400 text-gray-600">
            {balance && underlying0} {token0?.symbol}
          </Typography>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4">{token1 && <Icon currency={token1} width={16} height={16} />}</div>
          <Typography variant="xs" weight={500} className="flex items-center gap-1 dark:text-slate-400 text-gray-600">
            {balance && underlying1} {token1?.symbol}
          </Typography>
        </div>
      </div>
    </div>
  )
}
