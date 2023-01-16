import { ExternalLinkIcon } from '@heroicons/react/outline'
import { Chain } from '@sushiswap/chain'
import { shortenAddress } from '@sushiswap/format'
import { Button, CalendarIcon, Tooltip, Typography } from '@sushiswap/ui'
import { format } from 'date-fns'
import { FC, memo } from 'react'

import { PeriodType, Vesting, VestingType } from '../../lib'
import { Period, Schedule } from './createScheduleRepresentation'

interface Props {
  vesting?: Vesting
  schedule?: Schedule
}

export const SchedulePopover: FC<Props> = ({ vesting, schedule }) => {
  if (!vesting) return null

  return (
    <Tooltip
      naked
      button={
        <Button color="gray">
          <CalendarIcon width={18} height={18} />
          <Typography variant="sm" weight={500} className="text-slate-200">
            Schedule
          </Typography>
        </Button>
      }
      panel={
        <div className="overflow-hidden rounded-lg flex flex-col max-w-[530px] bg-slate-800">
          <div className="p-4 bg-slate-700">
            <div className="flex justify-between gap-10">
              <Typography variant="xs" className="!leading-5 text-slate-300">
                This stream to{' '}
                <span className="font-medium text-slate-200 hover:text-blue">
                  <a
                    target="_blank"
                    href={Chain.from(vesting.remainingAmount.currency.chainId)?.getAccountUrl(vesting.recipient.id)}
                    rel="noreferrer"
                  >
                    {shortenAddress(vesting.recipient.id)}
                  </a>
                </span>{' '}
                for a total of{' '}
                <span className="font-medium text-slate-200">
                  {vesting.remainingAmount?.toSignificant(6)} {vesting.remainingAmount?.currency.symbol}
                </span>{' '}
                <br /> runs from{' '}
                <span className="font-medium text-slate-200">
                  {format(new Date(vesting.startTime), 'dd MMM yyyy hh:mm')}
                </span>{' '}
                until{' '}
                <span className="font-medium text-slate-200">
                  {format(new Date(vesting.endTime), 'dd MMM yyyy hh:mm')}
                </span>
              </Typography>
              <a
                target="_blank"
                href={Chain.from(vesting.remainingAmount.currency.chainId)?.getTxUrl(vesting.txHash)}
                rel="noreferrer"
                className="-mt-1 -mr-1 p-1 hover:bg-[rgba(255,255,255,0.12)] rounded-full text-slate-400 hover:text-slate-300"
              >
                <ExternalLinkIcon width={20} height={20} />
              </a>
            </div>
            <div className="mt-6 grid grid-cols-[60px_80px_80px_auto] gap-2 items-center">
              <Typography weight={500} className="tracking-wider capitalize text-slate-400" variant="xxs">
                Schedule
              </Typography>
              <Typography weight={500} className="tracking-wider capitalize text-slate-400" variant="xxs">
                Date
              </Typography>
              <Typography weight={500} className="tracking-wider text-right capitalize text-slate-400" variant="xxs">
                Amount
              </Typography>
              <Typography weight={500} className="tracking-wider text-right capitalize text-slate-400" variant="xxs">
                Total
              </Typography>
            </div>
          </div>
          <div className="px-4 overflow-auto max-h-[240px] hide-scrollbar divide-y divide-slate-700/50">
            {schedule?.length ? (
              Object.values(schedule).map((period) => (
                <SchedulePopoverItem vesting={vesting} period={period} key={period.id} />
              ))
            ) : (
              <Typography variant="xs" className="flex items-center justify-center h-full py-4 italic text-slate-500">
                No schedule found
              </Typography>
            )}
          </div>
        </div>
      }
    />
  )
}

const SchedulePopoverItem: FC<{ vesting?: Vesting; period: Period }> = memo(({ vesting, period }) => {
  return (
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
      <Typography variant="xs" className="flex flex-col text-right truncate text-slate-200" weight={500}>
        {period.type === PeriodType.START
          ? `0`
          : period.type === PeriodType.CLIFF
          ? vesting?.cliffAmount.toSignificant(6)
          : period.type === PeriodType.STEP
          ? vesting?.stepAmount.toSignificant(6)
          : period.type === PeriodType.END &&
            (vesting?.vestingType === VestingType.GRADED || vesting?.vestingType === VestingType.HYBRID)
          ? vesting?.stepAmount.toSignificant(6)
          : vesting?.remainingAmount.toSignificant(6)}
        <Typography as="span" variant="xxs" className="text-slate-500">
          {period?.amount.currency?.symbol}
        </Typography>
      </Typography>
      <Typography variant="xs" className="flex flex-col text-right truncate text-slate-200" weight={500}>
        <span>
          {period?.total.toSignificant(6)}{' '}
          <span className="text-slate-500">/ {vesting?.remainingAmount.toSignificant(6)}</span>
        </span>
        <Typography as="span" variant="xxs" className="text-slate-500">
          {period?.amount.currency?.symbol}
        </Typography>
      </Typography>
    </div>
  )
})
