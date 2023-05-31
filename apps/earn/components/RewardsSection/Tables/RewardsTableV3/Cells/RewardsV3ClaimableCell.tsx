import React, { FC, useMemo } from 'react'

import { RewardTableV3CellProps } from './types'
import { useTokenAmountDollarValues } from '../../../../../lib/hooks'
import { formatNumber } from '@sushiswap/format'

export const RewardsV3ClaimableCell: FC<RewardTableV3CellProps> = ({ row }) => {
  const unclaimed = useMemo(() => Object.values(row.rewardsPerToken).map((el) => el.unclaimed), [row])
  const dollarValues = useTokenAmountDollarValues({ chainId: row.chainId, amounts: unclaimed })

  return (
    <span className="text-sm text-right text-gray-900 dark:text-slate-50">
      ${dollarValues.reduce((acc, cur) => acc + +formatNumber(cur), 0)}
    </span>
  )
}
