import { FC } from 'react'
import { Popover } from '@headlessui/react'
import Typography from 'ui/typography/Typography'
import { NotepadIcon } from 'ui/icons'

const StreamDetailsPopover = () => {
  return (
    <Popover>
      <Popover.Button>
        <div className="cursor-pointer flex items-center gap-2 shadow-md shadow-dark-1000 border border-dark-800 bg-dark-900 rounded-xl px-5 h-11">
          <NotepadIcon width={18} height={18} />
          <Typography variant="sm" weight={700} className="text-high-emphesis">
            Details
          </Typography>
        </div>
      </Popover.Button>
      <Popover.Panel className="absolute z-10 bg-dark-900 shadow-depth-1 p-4 rounded-xl border border-dark-800 flex flex-col gap-4 max-w-[530px]">
        <div className="flex gap-4 justify-between">
          <Typography variant="lg" weight={700} className="text-high-emphesis">
            Details
          </Typography>
          <div className="flex gap-6">
            <div className="flex gap-2 items-center justify-end">
              <Typography variant="xs" weight={700}>
                From:
              </Typography>
              <Typography
                weight={700}
                variant="xs"
                className="px-4 border border-dark-800 rounded-full py-2 shadow-depth-1"
              >
                0x19b3....19e7
              </Typography>
            </div>
            <div className="flex gap-2 items-center justify-end">
              <Typography variant="xs" weight={700}>
                To:
              </Typography>
              <Typography
                weight={700}
                variant="xs"
                className="px-4 border border-dark-800 rounded-full py-2 shadow-depth-1"
              >
                0x19b3....19e7
              </Typography>
            </div>
          </div>
        </div>
        <div className="flex flex-col rounded-xl shadow-depth-1 p-4 border border-dark-800">
          <Typography variant="xs" weight={400} className="text-secondary">
            Time Remaining
          </Typography>
          <Typography variant="lg" weight={700} className="text-high-emphesis mt-1">
            Time Remaining
          </Typography>
          <Typography variant="xs" weight={400} className="mt-3">
            The stream was started on 15 Feb 2021 @ 7:00pm and has been active for 156 days 3 hours 17 minutes. If the
            sender does not cancel the stream, the full amount will be disbursed to you on 15 Feb 2022 @ 7:00pm.
          </Typography>
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
              <Typography variant="h2" className="text-high-emphesis mt-3 items-center flex" weight={700}>
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
              <Typography variant="h2" className="text-high-emphesis mt-3 items-center flex" weight={700}>
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
              <Typography variant="h2" className="text-high-emphesis mt-3 items-center flex" weight={700}>
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
