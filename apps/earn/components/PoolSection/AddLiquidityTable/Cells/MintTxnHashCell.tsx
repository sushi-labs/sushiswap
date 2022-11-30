import { Typography } from '@sushiswap/ui'
import { FC } from 'react'
import { CellProps } from './types'

export const MintTxnHashCell: FC<CellProps> = ({row}) => {
  return (
		<Typography variant="sm" weight={500} className="flex items-center gap-1 text-slate-50">
			{row.transaction.id}
		</Typography>
	)
}
