import { Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { BorrowTable } from './BorrowTable'
import { LendTable } from './LendTable'

export const MarketsSection: FC = () => {
  return (
    <section className="space-y-8">
      <Typography variant="h3" weight={600} className="text-slate-50 font-semibold">
        Browse By Markets
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LendTable />
        <BorrowTable />
      </div>
    </section>
  )
}
