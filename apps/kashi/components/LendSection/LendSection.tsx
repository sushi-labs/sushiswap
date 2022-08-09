import { Chip, Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { LendTableForSymbol } from './LendTableForSymbol'

export const LendSection: FC = () => {
  return (
    <section className="space-y-4">
      <div className="flex w-full flex-col gap-6">
        <Typography variant="h3" weight={700} className="text-slate-50 font-semibold">
          Lend Markets <Chip label="4" color="blue" />
        </Typography>
      </div>
      <LendTableForSymbol />
    </section>
  )
}
