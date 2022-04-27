import { Popover } from '@headlessui/react'
import useInterval from 'app/hooks/useInterval'
import { shortenAddress } from 'format'
import { FC, useState } from 'react'
import { NotepadIcon } from 'ui/icons'
import Typography from 'ui/typography/Typography'
import { FuroStatus } from '../context/enums'
import { Stream } from '../context/Stream'
import { usePopover } from 'app/hooks/usePopover'
import Copy from 'ui/copy/Copy'

interface StreamTimerState {
  days: string
  hours: string
  minutes: string
  seconds: string
}

interface Props {
  stream: Stream
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

  const ActiveStreamDetails = () => {
    return (
      <>
        <Typography variant="xs" weight={400} className="text-secondary">
          Time Remaining
        </Typography>
        <Typography variant="lg" weight={700} className="mt-1 text-high-emphesis">
          {`${remaining?.days} days ${remaining?.hours} hours ${remaining?.minutes} min ${remaining?.seconds} sec`}
        </Typography>
        <Typography variant="xs" weight={400} className="mt-3">
          {`The stream was started on ${stream.startTime.toLocaleDateString()} @ ${stream.startTime.toLocaleTimeString()} and has been active for 
            ${stream.activeTime.days} days ${stream.activeTime.hours} hours ${stream.activeTime.minutes} minutes.
              If the sender does not cancel the stream, the full amount will be disbursed to you on 
              ${stream.endTime.toLocaleDateString()} @ ${stream.endTime.toLocaleTimeString()}.`}
        </Typography>
      </>
    )
  }

  const CancelledStreamDetails = () => {
    return (
      <>
        <Typography variant="xs" weight={400} className="text-secondary">
          Time Remaining
        </Typography>
        <Typography variant="lg" weight={700} className="mt-1 text-high-emphesis">
          -
        </Typography>
        <Typography variant="xs" weight={400} className="mt-3">
          {`The stream was cancelled on ${stream.modifiedAtTimestamp.toLocaleDateString()} @ ${stream.modifiedAtTimestamp.toLocaleTimeString()} and was active for 
          ${stream.activeTime.days} days ${stream.activeTime.hours} hours ${stream.activeTime.minutes} minutes. `}
        </Typography>
      </>
    )
  }

  const StreamDetails = () => {
    return stream.status !== FuroStatus.CANCELLED ? <ActiveStreamDetails /> : <CancelledStreamDetails />
  }

  return (
    <Popover>
      <Popover.Button ref={setReferenceElement}>
        <div className="flex items-center gap-2 px-5 border shadow-md cursor-pointer shadow-dark-1000 border-dark-800 bg-dark-900 rounded-xl h-11">
          <NotepadIcon width={18} height={18} />
          <Typography variant="sm" weight={700} className="text-high-emphesis">
            Details
          </Typography>
        </div>
      </Popover.Button>

      <Popover.Panel
        ref={setPopperElement}
        style={styles.popper}
        {...attributes.popper}
        className="z-10 bg-dark-900 shadow-depth-1 p-4 rounded-xl border border-dark-800 flex flex-col gap-4 max-w-[530px]"
      >
        <div className="flex justify-between gap-4">
          <Typography variant="lg" weight={700} className="text-high-emphesis">
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
                className="px-4 py-2 border rounded-full border-dark-800 shadow-depth-1"
              >
              <Copy toCopy={stream.createdBy.id}>
                {shortenAddress(stream.createdBy.id)}
              </Copy>
              </Typography>
              
            </div>
            <div className="flex items-center justify-end gap-2">
              <Typography variant="xs" weight={700}>
                To:
              </Typography>
              <Typography
                weight={700}
                variant="xs"
                className="px-4 py-2 border rounded-full border-dark-800 shadow-depth-1"
              >
              <Copy toCopy={stream.recipient.id}>
                {shortenAddress(stream.recipient.id)}
              </Copy>
              </Typography>
            </div>
          </div>
        </div>
        <div className="flex flex-col p-4 border rounded-xl shadow-depth-1 border-dark-800">
          <StreamDetails />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-4 p-4 border border-dark-800 rounded-xl shadow-depth-1">
            <div className="flex flex-col">
              <Typography variant="lg" className="text-high-emphesis" weight={700}>
                Total
              </Typography>
              <Typography variant="xs" className="text-secondary" weight={500}>
                Value of Stream
              </Typography>
              <Typography variant="h2" className="flex items-center mt-3 text-high-emphesis" weight={700}>
                119
                <Typography variant="lg" component="span" weight={700}>
                  .994k
                </Typography>
              </Typography>
            </div>
          </div>
          <div className="flex flex-col gap-4 p-4 bg-blue/60 rounded-xl shadow-depth-1">
            <div className="flex flex-col">
              <Typography variant="lg" className="text-high-emphesis" weight={700}>
                Total
              </Typography>
              <Typography variant="xs" weight={500}>
                42.67% of total
              </Typography>
              <Typography variant="h2" className="flex items-center mt-3 text-high-emphesis" weight={700}>
                51
                <Typography variant="lg" component="span" weight={700}>
                  .329k
                </Typography>
              </Typography>
            </div>
          </div>
          <div className="flex flex-col gap-4 p-4 bg-pink/60 rounded-xl shadow-depth-1">
            <div className="flex flex-col">
              <Typography variant="lg" className="text-high-emphesis" weight={700}>
                Total
              </Typography>
              <Typography variant="xs" weight={500}>
                38.67% of total
              </Typography>
              <Typography variant="h2" className="flex items-center mt-3 text-high-emphesis" weight={700}>
                49
                <Typography variant="lg" component="span" weight={700}>
                  .105k
                </Typography>
              </Typography>
            </div>
          </div>
        </div>
      </Popover.Panel>
    </Popover>
  )
}

export default StreamDetailsPopover
