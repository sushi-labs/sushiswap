import { Typography } from '@sushiswap/ui'
import { FC } from 'react'

export const StringCell: FC<{ string: string }> = ({ string }) => {
  return (
    <Typography variant="sm" weight={600} className="text-right text-slate-50">
      {string}
    </Typography>
  )
}
