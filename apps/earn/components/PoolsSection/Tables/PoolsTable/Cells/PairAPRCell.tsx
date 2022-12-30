import { formatPercent } from '@sushiswap/format'
import { Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { FarmRewardsAvailableTooltip } from '../../../../FarmRewardsAvailableTooltip'
import { CellProps } from './types'

export const PairAPRCell: FC<CellProps> = ({ row }) => {
  return (
    <Typography variant="sm" weight={600} className="flex items-center justify-end gap-1 text-slate-50">
      {!!row.farm && row.incentiveApr > 0 && <FarmRewardsAvailableTooltip />}
      {formatPercent(row.apr)}
      {/* {row.utilisation1dChange > 0 ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z"
            clipRule="evenodd"
          />
        </svg>
      )} */}
    </Typography>
  )
}
