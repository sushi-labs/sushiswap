import { Popover } from '@headlessui/react'
import { shortenAddress } from '@sushiswap/format'
import { useInterval } from '@sushiswap/hooks'
import { classNames, NotepadIcon, Typography } from '@sushiswap/ui'
import { FuroStatus, Stream } from 'features/context'
import { usePopover } from 'hooks'
import { FC, useState } from 'react'

interface StreamTimerState {
  days: string
  hours: string
  minutes: string
  seconds: string
}

interface Props {
  stream?: Stream
}

const StreamDetailsPopover: FC<Props> = ({ stream }) => {
  const [remaining, setRemaining] = useState<StreamTimerState>()
  const { styles, attributes, setReferenceElement, setPopperElement } = usePopover()

  useInterval(() => {
    if (!stream?.remainingTime) return { days: 0, hours: 0, minutes: 0, seconds: 0 }

    const { days, hours, minutes, seconds } = stream.remainingTime
    setRemaining({
      days: String(Math.max(days, 0)),
      hours: String(Math.max(hours, 0)),
      minutes: String(Math.max(minutes, 0)),
      seconds: String(Math.max(seconds, 0)),
    })
  }, 1000)

  return (
    <Popover>
      {({ open }) => (
        <>
          <Popover.Button ref={setReferenceElement}>
            <div
              className={classNames(
                open ? 'bg-slate-600' : '',
                'hover:ring-2 ring-slate-600 flex items-center gap-2 px-5 shadow-md cursor-pointer bg-slate-700 rounded-xl h-11',
              )}
            >
              <NotepadIcon width={18} height={18} />
              <Typography variant="sm" weight={700} className="text-slate-200">
                Details
              </Typography>
            </div>
          </Popover.Button>

          <Popover.Panel
            ref={setPopperElement}
            style={styles.popper}
            {...attributes.popper}
            className="z-10 bg-slate-800 shadow-md p-4 rounded-xl border border-slate-700 flex flex-col gap-4 max-w-[530px]"
          >
            <div className="flex justify-between gap-4">
              <Typography variant="lg" weight={700} className="text-slate-200">
                Details
              </Typography>
              <div className="flex gap-6">
                <div className="flex items-center justify-end gap-2">
                  <Typography variant="xs" weight={700}>
                    From:
                  </Typography>
                  <Typography
                    weight={700}
                    variant="xs"
                    onClick={() => stream && navigator.clipboard.writeText(stream.createdBy.id)}
                    className="px-4 py-2 border rounded-full shadow-md border-slate-700 hover:border-slate-700 active:border-slate-600"
                  >
                    {stream ? shortenAddress(stream.createdBy.id) : ''}
                  </Typography>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Typography variant="xs" weight={700}>
                    To:
                  </Typography>
                  <Typography
                    weight={700}
                    variant="xs"
                    onClick={() => stream && navigator.clipboard.writeText(stream.recipient.id)}
                    className="px-4 py-2 border rounded-full shadow-md border-slate-700 hover:border-slate-700 active:border-slate-600"
                  >
                    {stream ? shortenAddress(stream.recipient.id) : ''}
                  </Typography>
                </div>
              </div>
            </div>
            <div className="flex flex-col p-4 border shadow-md rounded-xl border-slate-700">
              {stream?.status !== FuroStatus.CANCELLED ? (
                <>
                  <Typography variant="xs" weight={400} className="text-slate-500">
                    Time Remaining
                  </Typography>
                  <Typography variant="lg" weight={700} className="mt-1 text-slate-300">
                    {`${remaining?.days} days ${remaining?.hours} hours ${remaining?.minutes} min ${remaining?.seconds} sec`}
                  </Typography>
                  <Typography variant="xs" weight={400} className="mt-3 text-slate-400">
                    {`The stream was started on ${stream?.startTime.toLocaleDateString()} @ ${stream?.startTime.toLocaleTimeString()} and has been active for 
            ${stream?.activeTime?.days} days ${stream?.activeTime?.hours} hours ${stream?.activeTime?.minutes} minutes.
              If the sender does not cancel the stream, the full amount will be disbursed to you on 
              ${stream?.endTime.toLocaleDateString()} @ ${stream?.endTime.toLocaleTimeString()}.`}
                  </Typography>
                </>
              ) : (
                <>
                  <Typography variant="xs" weight={400} className="text-slate-500">
                    Time Remaining
                  </Typography>
                  <Typography variant="lg" weight={700} className="mt-1 text-slate-200">
                    -
                  </Typography>
                  <Typography variant="xs" weight={400} className="mt-3">
                    {`The stream was cancelled on ${stream?.modifiedAtTimestamp.toLocaleDateString()} @ ${stream?.modifiedAtTimestamp.toLocaleTimeString()} and was active for 
          ${stream?.activeTime?.days} days ${stream?.activeTime?.hours} hours ${stream?.activeTime?.minutes} minutes. `}
                  </Typography>
                </>
              )}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-4 p-4 border shadow-md border-slate-700 rounded-xl">
                <div className="flex flex-col">
                  {/* TODO: Unit type for all of these values? Icon? Should it show USD value? */}
                  <Typography variant="lg" className="text-slate-200" weight={700}>
                    Total
                  </Typography>
                  <Typography variant="xs" className="text-slate-500" weight={500}>
                    Value of Stream
                  </Typography>
                  <Typography variant="h2" className="flex items-center mt-3 text-slate-200" weight={700}>
                    {stream?.amount.toFixed(4)}
                    <Typography variant="lg" component="span" weight={700}>
                      {/* .994k */}
                    </Typography>
                  </Typography>
                  <div className="mt-2">
                    <Typography
                      variant="xs"
                      weight={700}
                      className="text-slate-200 border border-slate-700 bg-slate-800 rounded-xl px-3 py-1.5"
                      component="span"
                    >
                      {stream?.withdrawnAmount.currency.symbol}
                    </Typography>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4 p-4 shadow-md bg-blue/30 rounded-xl">
                <div className="flex flex-col">
                  <Typography variant="lg" className="text-slate-200" weight={700}>
                    Streamed
                  </Typography>
                  <Typography variant="xs" weight={500}>
                    {(Number(stream?.streamedPercentage) * 100).toFixed(2)}% of total
                  </Typography>
                  <Typography variant="h2" className="flex items-center mt-3 text-slate-200" weight={700}>
                    {stream?.streamedAmount.substring(0, 7)}
                    <Typography variant="lg" component="span" weight={700}>
                      {/* .329k */}
                    </Typography>
                  </Typography>
                  <div className="mt-2">
                    <Typography
                      variant="xs"
                      weight={700}
                      className="text-slate-200 border border-slate-700 bg-slate-800 rounded-xl px-3 py-1.5"
                      component="span"
                    >
                      {stream?.withdrawnAmount.currency.symbol}
                    </Typography>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4 p-4 shadow-md bg-pink/30 rounded-xl">
                <div className="flex flex-col">
                  <Typography variant="lg" className="text-slate-200" weight={700}>
                    Withdrawn
                  </Typography>
                  <Typography variant="xs" weight={500}>
                    {(Number(stream?.withdrawnPercentage) * 100).toFixed(2)}% of total
                  </Typography>
                  <Typography variant="h2" className="flex items-center mt-3 text-slate-200" weight={700}>
                    {stream?.withdrawnAmount.toFixed(4)}
                    <Typography variant="lg" component="span" weight={700}>
                      {/* .105k */}
                    </Typography>
                  </Typography>
                  <div className="mt-2">
                    <Typography
                      variant="xs"
                      weight={700}
                      className="text-slate-200 border border-slate-700 bg-slate-800 rounded-xl px-3 py-1.5"
                      component="span"
                    >
                      {stream?.withdrawnAmount.currency.symbol}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          </Popover.Panel>
        </>
      )}
    </Popover>
  )
}

export default StreamDetailsPopover
