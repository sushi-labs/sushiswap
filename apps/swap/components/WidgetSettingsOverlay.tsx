import { CogIcon } from '@heroicons/react/outline'
import { Button, classNames, DEFAULT_INPUT_CLASSNAME, Form, Input, SlideIn, Typography } from '@sushiswap/ui'
import { FC, useState } from 'react'

import { Theme } from '../types'
import { OverlayContent, OverlayHeader } from './Overlay'

interface WidgetSettingsOverlay {
  theme: Theme
}

export const WidgetSettingsOverlay: FC<WidgetSettingsOverlay> = ({ theme }) => {
  const [open, setOpen] = useState(false)
  const [state, setState] = useState<string>()
  const [auto, setAuto] = useState<boolean>(false)

  return (
    <>
      <button className="hover:animate-spin-slow" onClick={() => setOpen(true)}>
        <CogIcon width={20} height={20} />
      </button>
      <SlideIn.FromLeft show={open} unmount={false} onClose={() => setOpen(false)}>
        <OverlayContent theme={theme} className="!bg-slate-800">
          <OverlayHeader onClose={() => setOpen(false)} title="Settings" theme={theme} />
          <Form.Control label="Slippage Tolerance">
            <div className="flex gap-2 items-center">
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
          </Form.Control>
        </OverlayContent>
      </SlideIn.FromLeft>
    </>
  )
}
