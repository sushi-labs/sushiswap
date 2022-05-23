import { Popover } from '@headlessui/react'
import { CalendarIcon, Chip, classNames, Typography } from '@sushiswap/ui'
import { format } from 'date-fns'
import { PeriodType, Schedule, SchedulePeriod, ScheduleRepresentation, Vesting, VestingType } from 'features/context'
import { usePopover } from 'hooks'
import { FC, memo, useMemo } from 'react'

interface Props {
  vesting?: Vesting
  scheduleRepresentation?: ScheduleRepresentation
}

const SchedulePopover: FC<Props> = ({ vesting, scheduleRepresentation }) => {
  const { styles, attributes, setReferenceElement, setPopperElement } = usePopover()
  const schedule = useMemo(
    () =>
      vesting && scheduleRepresentation
        ? new Schedule({ token: vesting.token, schedule: scheduleRepresentation })
        : undefined,
    [vesting, scheduleRepresentation]
  )

  return (
    <Popover>
      <Popover.Button ref={setReferenceElement}>
        {({ open }) => (
          <div
            className={classNames(
              open ? 'bg-slate-600' : '',
              'hover:ring-2 ring-slate-600 flex items-center gap-2 px-5 shadow-md cursor-pointer bg-slate-700 rounded-xl h-11'
            )}
          >
            <CalendarIcon width={18} height={18} />
            <Typography variant="sm" weight={700} className="text-slate-200">
              Schedule
            </Typography>
          </div>
        )}
      </Popover.Button>
      <Popover.Panel
        ref={setPopperElement}
        style={styles.popper}
        {...attributes.popper}
        className="border border-slate-700 overflow-hidden z-10 bg-slate-800 shadow-md rounded-xl flex flex-col gap-4 max-w-[530px]"
      >
        <div className="max-h-[440px] min-w-[258px] whitespace-nowrap overflow-auto flex flex-col divide-y divide-slate-800">
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
      </Popover.Panel>
    </Popover>
  )
}

const SchedulePopoverItem: FC<{ vesting?: Vesting; period: SchedulePeriod }> = memo(({ vesting, period }) => {
  return (
    <div key={period.id} className="even:bg-slate-700/40 flex items-center justify-between gap-7 py-2 px-4">
      <Typography variant="xs" className="text-slate-500 flex flex-col text-left" weight={500}>
        {format(period.date, 'dd MMM yyyy')}
        <span>{format(period.date, 'hh:maaa')}</span>
      </Typography>
      <div className="grid grid-cols-[80px_100px] gap-2 items-center justify-center">
        <div>
          <Chip color="default" label={period.type.toLowerCase()} className="capitalize" />
        </div>
        <Typography variant="xs" weight={500} className="text-slate-200">
          {period.type === PeriodType.START
            ? ``
            : period.type === PeriodType.CLIFF
            ? vesting?.cliffAmount.toSignificant(4)
            : period.type === PeriodType.STEP
            ? vesting?.stepAmount.toSignificant(4)
            : period.type === PeriodType.END &&
              (vesting?.vestingType === VestingType.GRADED || vesting?.vestingType === VestingType.HYBRID)
            ? vesting?.stepAmount.toSignificant(4)
            : vesting?.amount.toExact()}
          {period.type !== PeriodType.START && (
            <span className="text-xs text-slate-500 font-medium"> {period?.amount.currency?.symbol}</span>
          )}
        </Typography>
      </div>
    </div>
  )
})

SchedulePopoverItem.displayName = 'HistoryPopoverTransaction'

export default SchedulePopover
