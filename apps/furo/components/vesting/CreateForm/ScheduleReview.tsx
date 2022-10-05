import { Amount, Type } from '@sushiswap/currency'
import { Typography } from '@sushiswap/ui'
import { format } from 'date-fns'
import React, { FC, ReactNode } from 'react'

import { Schedule } from '../createScheduleRepresentation'

interface ScheduleReview {
  currency: Type
  schedule: Schedule | undefined
}

export const ScheduleReview: FC<ScheduleReview> = ({ schedule, currency }) => {
  return (
    <div className="flex flex-col w-full">
      <div className="border px-2 rounded-lg border-slate-800 overflow-auto max-h-[240px] hide-scrollbar divide-y divide-slate-800">
        <div className="py-2 grid grid-cols-[60px_80px_80px_auto] gap-2 items-center">
          <Typography className="tracking-wider capitalize text-slate-500" variant="xxs">
            Schedule
          </Typography>
          <Typography className="tracking-wider capitalize text-slate-500" variant="xxs">
            Date
          </Typography>
          <Typography className="tracking-wider text-right capitalize text-slate-500" variant="xxs">
            Amount
          </Typography>
          <Typography className="tracking-wider text-right capitalize text-slate-500" variant="xxs">
            Total
          </Typography>
        </div>
        {
          schedule?.reduce<[ReactNode[], Amount<Type>]>(
            (acc, period) => {
              acc[1] = acc[1].add(period.amount)
              acc[0].push(
                <div key={period.id} className="py-2 grid grid-cols-[60px_80px_80px_auto] gap-2 items-center">
                  <Typography className="tracking-wider capitalize text-slate-200" weight={500} variant="xxs">
                    {period.type.toLowerCase()}
                  </Typography>
                  <Typography variant="xs" className="flex flex-col text-left text-slate-200" weight={500}>
                    {format(period.date, 'dd MMM yyyy')}
                    <Typography as="span" variant="xxs" className="text-slate-500">
                      {format(period.date, 'hh:mmaaa')}
                    </Typography>
                  </Typography>
                  <Typography variant="xs" className="flex flex-col text-right text-slate-200" weight={500}>
                    {period.amount.toSignificant(6)}
                    <Typography as="span" variant="xxs" className="text-slate-500">
                      {period?.amount.currency?.symbol}
                    </Typography>
                  </Typography>
                  <Typography variant="xs" className="flex flex-col text-right text-slate-200" weight={500}>
                    {acc[1].toSignificant(6)}
                    <Typography as="span" variant="xxs" className="text-slate-500">
                      {period?.amount.currency?.symbol}
                    </Typography>
                  </Typography>
                </div>
              )
              return acc
            },
            [[], Amount.fromRawAmount(currency, '0')]
          )[0]
        }
      </div>
    </div>
  )
}
