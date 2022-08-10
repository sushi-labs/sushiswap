import { Chip, Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { BorrowTableForSymbol } from './BorrowTableForSymbol'

export const BorrowSection: FC = () => {
  return (
    <section className="space-y-6">
      <div className="flex w-full flex-col gap-6">
        <Typography variant="h3" weight={500} className="flex gap-2 items-center text-slate-50 font-semibold">
          Borrow Markets <Chip label="4" color="blue" />
        </Typography>
      </div>
      <BorrowTableForSymbol />
    </section>
  )
}
