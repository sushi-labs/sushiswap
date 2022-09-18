import { Disclosure, Transition } from '@headlessui/react'
import { ChevronRightIcon, InformationCircleIcon } from '@heroicons/react/outline'
import { useIsMounted } from '@sushiswap/hooks'
import { CarbonIcon, classNames, Overlay, SlideIn, Switch, Tab, Tooltip, Typography } from '@sushiswap/ui'
import React, { FC, useState } from 'react'

const TOKENS = ['BCT', 'NCT', 'UBO', 'NBO', 'MCO2']

export const CarbonOffsetOverlay: FC = () => {
  const isMounted = useIsMounted()
  const [open, setOpen] = useState<boolean>(false)
  const [enabled, setEnabled] = useState<boolean>(false)
  const [tokenIndex, setTokenIndex] = useState<number>(0)

  if (!isMounted) return <></>

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="group items-center relative rounded-xl flex justify-between gap-3 w-full"
      >
        <div className="w-5 h-5 flex items-center justify-center">
          <CarbonIcon width={20} height={20} className="-ml-0.5 text-slate-500" />
        </div>
        <div className="flex gap-1 w-full justify-between items-center py-4">
          <div className="flex gap-1 items-center">
            <Typography variant="sm" weight={500}>
              Carbon Offset
            </Typography>
            <Tooltip
              button={<InformationCircleIcon width={14} height={14} />}
              panel={
                <div className="w-80 flex flex-col gap-2">
                  <Typography variant="xs" weight={500}>
                    Make transactions climate positive by offsetting them with Klima Infinity. The average cost to
                    offset a transaction on Polygon is {'<'}$0.01. Learn more
                  </Typography>
                </div>
              }
            />
          </div>
          <div className="flex gap-1">
            <Typography variant="sm" weight={500} className="group-hover:text-slate-200 text-slate-400">
              {enabled ? 'On' : 'Off'}
            </Typography>
            <div className="w-5 h-5 -mr-1.5 flex items-center">
              <ChevronRightIcon width={16} height={16} className="group-hover:text-slate-200 text-slate-300" />
            </div>
          </div>
        </div>
      </button>
      <SlideIn.FromLeft show={open} onClose={() => setOpen(false)} className="!mt-0">
        <Overlay.Content className="!bg-slate-800">
          <Overlay.Header onClose={() => setOpen(false)} title="Carbon Offset" />
          <div className="flex flex-col gap-2 py-3 mx-1 border-b border-slate-200/5">
            <div className="flex justify-between items-center gap-3 mb-1">
              <Typography variant="sm" className="text-slate-50" weight={500}>
                Carbon Offset
              </Typography>
              <Switch checked={enabled} onChange={() => setEnabled((prev) => !prev)} size="sm" />
            </div>
            <Typography variant="xs" weight={400} className="text-slate-500">
              Make transactions climate positive by offsetting them with Klima Infinity.
            </Typography>
            <Typography variant="xs" weight={400} className="text-slate-500">
              The average cost to offset a transaction on Polygon is {'<'}$0.01. Learn more{' '}
            </Typography>
          </div>
          <Disclosure>
            {({ open }) => (
              <div className="mx-1">
                <Disclosure.Button className="relative flex items-center justify-between w-full gap-3 group rounded-xl">
                  <div className="flex items-center justify-between w-full gap-1 py-4">
                    <Typography variant="sm" weight={500}>
                      Offset Token
                    </Typography>
                    <div className="flex gap-1">
                      <Typography variant="sm" weight={500} className="group-hover:text-slate-200 text-slate-400">
                        {TOKENS[tokenIndex]}
                      </Typography>
                      <div
                        className={classNames(
                          open ? 'rotate-90' : 'rotate-0',
                          'transition-all w-5 h-5 -mr-1.5 flex items-center delay-300'
                        )}
                      >
                        <ChevronRightIcon
                          width={16}
                          height={16}
                          className="group-hover:text-slate-200 text-slate-300"
                        />
                      </div>
                    </div>
                  </div>
                </Disclosure.Button>

                <Transition
                  unmount={false}
                  className="transition-[max-height] overflow-hidden mb-3"
                  enter="duration-300 ease-in-out"
                  enterFrom="transform max-h-0"
                  enterTo="transform max-h-[380px]"
                  leave="transition-[max-height] duration-250 ease-in-out"
                  leaveFrom="transform max-h-[380px]"
                  leaveTo="transform max-h-0"
                >
                  <Disclosure.Panel>
                    <Tab.Group selectedIndex={0} onChange={setTokenIndex}>
                      <Tab.List>
                        {TOKENS.map((el) => {
                          return <Tab key={el}>{el}</Tab>
                        })}
                      </Tab.List>
                    </Tab.Group>
                  </Disclosure.Panel>
                </Transition>
              </div>
            )}
          </Disclosure>
        </Overlay.Content>
      </SlideIn.FromLeft>
    </div>
  )
}
