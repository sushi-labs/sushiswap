import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline'
import { LockClosedIcon, LockOpenIcon } from '@heroicons/react/solid'
import { formatNumber } from '@sushiswap/format'
import { useInterval } from '@sushiswap/hooks'
import { ZERO } from '@sushiswap/math'
import { classNames, ProgressBar, ProgressColor, Tooltip, Typography } from '@sushiswap/ui'
import { format } from 'date-fns'
import { FC, useState } from 'react'

import { FuroStatus, PeriodType, Vesting } from '../../lib'
import { ChartHover } from '../../types'
import { Period, Schedule } from './createScheduleRepresentation'

interface VestingChart {
  vesting?: Vesting
  schedule?: Schedule
  hover?: ChartHover
  setHover?(x: ChartHover): void
}

const Timer: FC<{ date: Date }> = ({ date }) => {
  const [remaining, setRemaining] = useState<{
    days: string
    hours: string
    minutes: string
    seconds: string
  }>()

  useInterval(() => {
    const now = Date.now()
    const interval = date.getTime() - now

    const days = Math.floor(interval / (1000 * 60 * 60 * 24))
    const hours = Math.floor((interval % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((interval % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((interval % (1000 * 60)) / 1000)

    setRemaining({
      days: String(Math.max(days, 0)).padStart(2, '0'),
      hours: String(Math.max(hours, 0)).padStart(2, '0'),
      minutes: String(Math.max(minutes, 0)).padStart(2, '0'),
      seconds: String(Math.max(seconds, 0)).padStart(2, '0'),
    })
  }, 1000)

  return (
    <div className="flex justify-center gap-4 text-slate-200">
      <div className="flex flex-col text-center">
        <Typography variant="sm" weight={500} className="text-slate-200">
          {remaining?.days}
        </Typography>
        <Typography variant="xs" className="text-slate-400">
          days
        </Typography>
      </div>
      <div className="flex flex-col text-center">
        <Typography variant="sm" weight={500} className="text-slate-200">
          {remaining?.hours}
        </Typography>
        <Typography variant="xs" className="text-slate-400">
          hours
        </Typography>
      </div>
      <div className="flex flex-col text-center">
        <Typography variant="sm" weight={500} className="text-slate-200">
          {remaining?.minutes}
        </Typography>
        <Typography variant="xs" className="text-slate-400">
          min
        </Typography>
      </div>
      <div className="flex flex-col text-center">
        <Typography variant="sm" weight={500} className="text-slate-200">
          {remaining?.seconds}
        </Typography>
        <Typography variant="xs" className="text-slate-400">
          sec
        </Typography>
      </div>
    </div>
  )
}

const Block: FC<{
  vesting: Vesting
  period: Period
  length: number
  className: string
}> = ({ vesting, period, length }) => {
  const now = vesting.status === FuroStatus.CANCELLED ? vesting.modifiedAtTimestamp.getTime() : Date.now()
  const unlocked = period.date.getTime() < now
  const end = period.date.getTime()
  const start = end - length

  const progress = Math.min(Math.max(now - start, 0) / (end - start), 1)

  return (
    <Tooltip
      button={
        <div
          className={classNames(
            'w-full hover:ring-2 ring-offset-2 ring-offset-slate-900 ring-slate-700 relative bg-slate-800 rounded-xl flex flex-col gap-1 items-center justify-center h-30 p-4 pt-8'
          )}
        >
          <Typography variant="xxs" weight={500} className="absolute uppercase text-slate-500 top-2 left-3">
            {[PeriodType.STEP, PeriodType.END].includes(period.type) ? 'Payout' : 'Cliff End'}
          </Typography>
          {unlocked ? <LockOpenIcon width={24} /> : <LockClosedIcon width={24} />}
          <Typography variant="sm" weight={500} className="w-full text-center truncate text-slate-200">
            {formatNumber(+period.amount.toSignificant(4)) === 'NaN'
              ? '0.00'
              : formatNumber(+period.amount.toSignificant(4))}{' '}
            <span className="text-sm text-slate-400">{period.amount.currency.symbol}</span>
          </Typography>
          <Typography variant="xs" className="text-slate-500">
            {format(period.date, 'dd MMM yyyy')}
          </Typography>
          <div className="w-full mt-2">
            <ProgressBar
              showLabel={false}
              progress={progress}
              color={progress === 1 ? ProgressColor.GREEN : ProgressColor.BLUE}
            />
          </div>
        </div>
      }
      panel={
        <div className="flex flex-col gap-3">
          <Typography variant="xxs" weight={500} className="text-slate-300">
            {vesting.status === FuroStatus.CANCELLED ? 'Cancelled' : 'Unlocks In'}
          </Typography>
          <Timer
            date={
              vesting.status === FuroStatus.CANCELLED ? vesting.modifiedAtTimestamp : new Date(period.date.getTime())
            }
          />
        </div>
      }
    />
  )
}

const VestingChart2: FC<VestingChart> = ({ vesting, schedule, hover = ChartHover.NONE, setHover }) => {
  const PAGE_SIZE = 3

  const [index, setIndex] = useState(0)

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="z-10 overflow-hidden bg-slate-800 rounded-2xl">
        <div className="flex flex-col bg-gradient-to-b from-slate-800 via-slate-800 to-blue/25 h-[228px] items-center justify-center w-full">
          {[ChartHover.STREAMED, ChartHover.NONE].includes(hover) && (
            <div className="flex flex-col gap-3">
              <Typography variant="xs" className="uppercase text-center tracking-[0.2rem]">
                Unlocked
              </Typography>
              <div className="flex flex-col gap-1">
                <Typography variant="h1" weight={500} className="text-center text-slate-50">
                  {vesting?.streamedAmount?.toSignificant(6).split('.')[0]}
                  <Typography variant="h3" weight={500} className="text-slate-300" as="span">
                    .
                    {vesting?.streamedAmount?.greaterThan(ZERO)
                      ? vesting?.streamedAmount.toFixed(6).split('.')[1]
                      : '000000'}
                  </Typography>
                </Typography>
                <Typography variant="sm" className="text-slate-500" weight={500}>
                  / {formatNumber(vesting?.totalAmount.toSignificant(6))} {vesting?.token.symbol} Total
                </Typography>
              </div>
            </div>
          )}
          {hover === ChartHover.WITHDRAW && (
            <div className="flex flex-col justify-center gap-3">
              <Typography variant="xs" className="uppercase text-center tracking-[0.2rem]">
                Withdrawn
              </Typography>
              <div className="flex flex-col gap-1">
                <Typography variant="h1" weight={500} className="text-center text-slate-50">
                  {vesting?.withdrawnAmount?.toSignificant(6).split('.')[0]}
                  <Typography variant="h3" weight={500} className="text-slate-300" as="span">
                    .
                    {vesting?.withdrawnAmount?.greaterThan(ZERO)
                      ? vesting?.withdrawnAmount.toFixed(6).split('.')[1]
                      : '000000'}
                  </Typography>
                </Typography>
                <Typography variant="sm" className="text-slate-500" weight={500}>
                  / {formatNumber(vesting?.totalAmount.toSignificant(6))} {vesting?.token.symbol} Total
                </Typography>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="relative flex flex-col md:flex-row">
        {index > 0 && (
          <div className="absolute items-center hidden h-full md:flex -left-12">
            <button className="p-1 rounded-full cursor-pointer group bg-blue hover:bg-blue-400">
              <ChevronLeftIcon
                className="text-slate-200 hover:text-white"
                width={24}
                onClick={() => setIndex((prevState) => prevState - 1)}
              />
            </button>
          </div>
        )}
        <div className="grid order-1 w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {vesting &&
            schedule &&
            schedule.length > 1 &&
            schedule
              .slice(index + 1, index + 1 + PAGE_SIZE)
              .map((period, _index) => (
                <Block
                  vesting={vesting}
                  period={period}
                  key={_index}
                  length={period.date.getTime() - schedule[index + _index].date.getTime()}
                  className="translate"
                />
              ))}
        </div>
        {schedule && index + 1 + PAGE_SIZE < schedule.length && (
          <div className="absolute items-center hidden h-full md:flex -right-12">
            <button className="p-1 rounded-full cursor-pointer group bg-blue hover:bg-blue-400">
              <ChevronRightIcon
                className="text-slate-200 hover:text-white"
                width={24}
                onClick={() => setIndex((prevState) => prevState + 1)}
              />
            </button>
          </div>
        )}
        <div className="grid justify-center order-2 grid-cols-2 gap-10 mt-5 md:hidden">
          <div className="flex justify-end">
            <button className="p-2 rounded-full cursor-pointer group bg-blue hover:bg-blue-400">
              <ChevronLeftIcon
                className="text-slate-200 group-hover:text-white"
                width={24}
                onClick={() => setIndex((prevState) => (prevState - PAGE_SIZE < 0 ? prevState : prevState - PAGE_SIZE))}
              />
            </button>
          </div>
          <div className="flex justify-start">
            <button className="p-2 rounded-full cursor-pointer group bg-blue hover:bg-blue-400">
              <ChevronRightIcon
                className="text-slate-200 group-hover:text-white"
                width={24}
                onClick={() =>
                  setIndex((prevState) => {
                    if (!schedule) return prevState

                    // set to start of next page to prevent jankiness
                    const previousPage = Math.floor(prevState / PAGE_SIZE)
                    const nextIndex = previousPage * PAGE_SIZE + PAGE_SIZE

                    return schedule.length - 1 < nextIndex ? prevState : nextIndex
                  })
                }
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VestingChart2
