import { CogIcon } from '@heroicons/react/outline'
import { ChainId } from '@sushiswap/chain'
import { Overlay, SlideIn } from '@sushiswap/ui'
import { FC, useState } from 'react'
import { useFeeData } from 'wagmi'

import { GasSettingsOverlay } from './GasSettingsOverlay'
import { SlippageToleranceOverlay } from './SlippageToleranceOverlay'

interface SettingsOverlay {
  chainId: ChainId | undefined
}

export const SettingsOverlay: FC<SettingsOverlay> = ({ chainId }) => {
  const { data } = useFeeData({
    formatUnits: 'gwei',
    chainId,
    watch: true,
  })

  const [open, setOpen] = useState(false)
  const [state, setState] = useState<string>()
  const [auto, setAuto] = useState<boolean>(false)

  return (
    <>
      <button className="hover:animate-spin-slow" onClick={() => setOpen(true)}>
        <CogIcon width={20} height={20} />
      </button>
      <SlideIn.FromLeft show={open} unmount={false} onClose={() => setOpen(false)}>
        <Overlay.Content className="!bg-slate-800">
          <Overlay.Header onClose={() => setOpen(false)} title="Settings" />
          <div className="bg-slate-700 rounded-xl py-1 px-3">
            <GasSettingsOverlay chainId={chainId} />
            <SlippageToleranceOverlay />
          </div>
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
