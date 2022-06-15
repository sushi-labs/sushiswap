import { CogIcon } from '@heroicons/react/outline'
import { SlideIn } from '@sushiswap/ui'
import { FC, useState } from 'react'
import { Theme } from 'types'

import { Overlay } from './Overlay'

interface SettingsOverlay {
  theme: Theme
}

export const SettingsOverlay: FC<SettingsOverlay> = ({ theme }) => {
  const [open, setOpen] = useState(false)
  const [state, setState] = useState<string>()
  const [auto, setAuto] = useState<boolean>(false)

  return (
    <>
      <button className="hover:animate-spin-slow" onClick={() => setOpen(true)}>
        <CogIcon width={20} height={20} />
      </button>
      <SlideIn.FromLeft show={open} unmount={false} onClose={() => setOpen(false)}>
        <Overlay.Content theme={theme} className="!bg-slate-800">
          <Overlay.Header onClose={() => setOpen(false)} title="Settings" theme={theme} />

          {/* <Form.Control label="Gas price">
            <div className="flex flex-row p-1 bg-slate-900 rounded-xl">
              <Button variant="filled" className="w-1/2">
                Basic
              </Button>
              <Button variant="outlined" color="transparent" className="w-1/2">
                Advanced
              </Button>
            </div>

            <div className="flex flex-col bg-slate-900 rounded-xl ">
              <Button
                onClick={() => {
                  //
                }}
                size="sm"
                color="gray"
                variant="empty"
                className="text-left rounded-xl"
              >
                Instant
              </Button>
              <Button
                onClick={() => {
                  //
                }}
                size="sm"
                color="gray"
                variant="empty"
                className="text-left rounded-xl"
              >
                High
              </Button>
              <Button
                onClick={() => {
                  //
                }}
                size="sm"
                color="gray"
                variant="empty"
                className="text-left rounded-xl"
              >
                Medium
              </Button>
              <Button
                onClick={() => {
                  //
                }}
                size="sm"
                color="gray"
                variant="empty"
                className="text-left rounded-xl"
              >
                Low
              </Button>
            </div>
          </Form.Control> */}
          {/* <Form.Control label="Slippage Tolerance">
            <div className="flex items-center gap-2">
              <Button onClick={() => setAuto(true)} color={auto ? 'blue' : 'gray'} size="sm" className="rounded-xl">
                Auto
              </Button>
              <div
                className={classNames(
                  auto ? '' : '!ring-offset-2 !ring-offset-slate-800 !ring-blue !ring-2',
                  'flex w-full items-center bg-slate-700 h-[36px] px-3 rounded-xl'
                )}
              >
                <Input.Numeric
                  className={classNames(
                    DEFAULT_INPUT_CLASSNAME,
                    'text-right flex-grow !outline-none !ring-0 !ring-offset-0 !text-base'
                  )}
                  placeholder="0.5"
                  value={state}
                  onUserInput={(val) => {
                    setAuto(false)
                    setState(val)
                  }}
                />
                <Typography weight={700} className="text-slate-200">
                  %
                </Typography>
              </div>
            </div>
          </Form.Control> */}
          {/* <Button color="transparent">Liquidity sources</Button>
          <Button color="transparent">Manage token lists</Button>
          <Button color="transparent">Custom tokens</Button> */}
        </Overlay.Content>
      </SlideIn.FromLeft>
    </>
  )
}
