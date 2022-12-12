import { Typography } from '@sushiswap/ui'
import { FC } from 'react'
import { shortenAddress } from '@sushiswap/format'
import { CellProps } from './types'

export const MintSenderCell: FC<CellProps> = ({row}) => {
  return (
		<Typography variant="sm" weight={500} className="flex items-center gap-1 text-slate-50">
			{shortenAddress(row.sender)}
		</Typography>
	)
}
