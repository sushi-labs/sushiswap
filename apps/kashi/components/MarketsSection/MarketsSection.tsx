import { Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { BorrowTable } from './BorrowTable'
import { LendTable } from './LendTable'

export const MarketsSection: FC = () => {
  return (
    <section className="space-y-4">
      <div className="flex w-full flex-col gap-6">
        <Typography variant="h3" weight={700} className="text-slate-50 font-semibold">
          Markets
        </Typography>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <LendTable />
        <BorrowTable />
      </div>
    </section>
  )
}
