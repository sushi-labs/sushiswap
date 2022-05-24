import { ExternalLinkIcon } from '@heroicons/react/outline'
import { shortenAddress } from '@sushiswap/format'
import { CalendarIcon, Popover, Typography } from '@sushiswap/ui'
import { format } from 'date-fns'
import { PeriodType, Schedule, SchedulePeriod, ScheduleRepresentation, Vesting, VestingType } from 'features/context'
import { getExplorerLink } from 'functions'
import { FC, memo, useMemo } from 'react'

interface Props {
  vesting?: Vesting
  scheduleRepresentation?: ScheduleRepresentation
}

const SchedulePopover: FC<Props> = ({ vesting, scheduleRepresentation }) => {
  const schedule = useMemo(
    () =>
      vesting && scheduleRepresentation
        ? new Schedule({ token: vesting.token, schedule: scheduleRepresentation })
        : undefined,
    [vesting, scheduleRepresentation]
  )

  if (!vesting) return null

  return (
    <Popover
      button={
        <div className="hover:ring-2 active:bg-slate-500 focus:bg-slate-500 hover:bg-slate-600 ring-slate-600 flex items-center gap-2 px-5 shadow-md cursor-pointer bg-slate-700 rounded-xl h-11">
          <CalendarIcon width={18} height={18} />
          <Typography variant="sm" weight={700} className="text-slate-200">
            Schedule
          </Typography>
        </div>
      }
      panel={
        <div className="z-10 shadow-md overflow-hidden rounded-xl flex flex-col max-w-[530px] bg-slate-800">
          <div className="p-4 bg-slate-700">
            <div className="flex gap-10 items-start">
              <Typography variant="xs" className="!leading-5 text-slate-300">
                This stream to{' '}
                <span className="font-bold text-slate-200 hover:text-blue">
                  <a
                    target="_blank"
                    href={getExplorerLink(vesting.amount.currency.chainId, vesting.recipient.id, 'address')}
                    rel="noreferrer"
                  >
                    {shortenAddress(vesting.recipient.id)}
                  </a>
                </span>{' '}
                for a total of{' '}
                <span className="font-bold text-slate-200">
                  {vesting.amount?.toSignificant(6)} {vesting.amount?.currency.symbol}
                </span>{' '}
                <br /> runs from{' '}
                <span className="font-bold text-slate-200">
                  {format(new Date(vesting.startTime), 'dd MMM yyyy hh:mm')}
                </span>{' '}
                until{' '}
                <span className="font-bold text-slate-200">
                  {format(new Date(vesting.endTime), 'dd MMM yyyy hh:mm')}
                </span>
              </Typography>
              <a
                target="_blank"
                href={getExplorerLink(vesting.amount.currency.chainId, vesting.txHash, 'transaction')}
                rel="noreferrer"
                className="-mt-1 -mr-1 p-1 hover:bg-[rgba(255,255,255,0.12)] rounded-full text-slate-400 hover:text-slate-300"
              >
                <ExternalLinkIcon width={20} height={20} />
              </a>
            </div>
            <div className="mt-6 grid grid-cols-[60px_80px_80px_auto] gap-2 items-center">
              <Typography weight={700} className="capitalize text-slate-400 tracking-wider" variant="xxs">
                Schedule
              </Typography>
              <Typography weight={700} className="capitalize text-slate-400 tracking-wider" variant="xxs">
                Date
              </Typography>
              <Typography weight={700} className="capitalize text-slate-400 tracking-wider text-right" variant="xxs">
                Amount
              </Typography>
              <Typography weight={700} className="capitalize text-slate-400 tracking-wider text-right" variant="xxs">
                Total
              </Typography>
            </div>
          </div>
          <div className="px-4 overflow-auto max-h-[240px] hide-scrollbar divide-y divide-slate-700/50">
            {schedule?.periods.length ? (
              Object.values(schedule.periods).map((period) => (
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

const SchedulePopoverItem: FC<{ vesting?: Vesting; period: SchedulePeriod }> = memo(({ vesting, period }) => {
  return (
    <div key={period.id} className="py-2 grid grid-cols-[60px_80px_80px_auto] gap-2 items-center">
      <Typography className="capitalize text-slate-200 tracking-wider" weight={700} variant="xxs">
        {period.type.toLowerCase()}
      </Typography>
      <Typography variant="xs" className="text-slate-200 flex flex-col text-left" weight={500}>
        {format(period.date, 'dd MMM yyyy')}
        <Typography as="span" variant="xxs" className="text-slate-500">
          {format(period.date, 'hh:maaa')}
        </Typography>
      </Typography>
      <Typography variant="xs" className="text-slate-200 flex flex-col text-right" weight={700}>
        {period.type === PeriodType.START
          ? `0`
          : period.type === PeriodType.CLIFF
          ? vesting?.cliffAmount.toSignificant(6)
          : period.type === PeriodType.STEP
          ? vesting?.stepAmount.toSignificant(6)
          : period.type === PeriodType.END &&
            (vesting?.vestingType === VestingType.GRADED || vesting?.vestingType === VestingType.HYBRID)
          ? vesting?.stepAmount.toSignificant(6)
          : vesting?.amount.toSignificant(6)}
        <Typography as="span" variant="xxs" className="text-slate-500">
          {period?.amount.currency?.symbol}
        </Typography>
      </Typography>
      <Typography variant="xs" className="text-slate-200 flex flex-col text-right" weight={700}>
        <span>
          {period?.amount.toSignificant(6)} <span className="text-slate-500">/ {vesting?.amount.toSignificant(6)}</span>
        </span>
        <Typography as="span" variant="xxs" className="text-slate-500">
          {period?.amount.currency?.symbol}
        </Typography>
      </Typography>
    </div>
  )
})

export default SchedulePopover
