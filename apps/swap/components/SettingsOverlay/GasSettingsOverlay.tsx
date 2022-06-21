import { RadioGroup, Transition } from '@headlessui/react'
import { ChevronRightIcon } from '@heroicons/react/outline'
import { CheckCircleIcon } from '@heroicons/react/solid'
import { ChainId } from '@sushiswap/chain'
import { useIsMounted } from '@sushiswap/hooks'
import { CircleIcon, classNames, GasIcon, Overlay, SlideIn, Typography } from '@sushiswap/ui'
import { FC, useState } from 'react'
import { useFeeData } from 'wagmi'

import { GasPrice, useSettings } from '../../lib/state/settings'

interface GasSettingsOverlay {
  chainId: ChainId | undefined
}

export const GasSettingOption: FC<{ onClick?(): void; value: GasPrice; data: string }> = ({ onClick, value, data }) => {
  const [hover, setHover] = useState<boolean>(false)

  return (
    <RadioGroup.Option
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      value={value}
      className={({ checked }) =>
        classNames(
          checked ? 'ring-2 !ring-blue-500/40 border-blue' : '',
          'cursor-pointer border-2 border-slate-700 hover:border-blue transform-all duration-400 bg-slate-700 active:ring-3 rounded-lg relative pl-3 py-2 pr-10'
        )
      }
    >
      {({ checked }) => (
        <div className="flex items-center gap-2">
          <div className="absolute right-3">
            <Transition
              show={hover || checked}
              enter="transition-all duration-150"
              enterFrom="scale-[.25]"
              enterTo="scale-100"
              leave="transition-opacity duration-150"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              {checked ? (
                <CheckCircleIcon className="text-blue" width={24} height={24} />
              ) : (
                <div className="w-6 h-6 flex justify-center items-center">
                  <CircleIcon className="text-blue" width={22} height={22} />
                </div>
              )}
            </Transition>
          </div>
          <div className="flex flex-col">
            <Typography variant="sm" weight={700}>
              {value}
            </Typography>
            <Typography variant="xs" className="text-slate-400">
              {data}
            </Typography>
          </div>
        </div>
      )}
    </RadioGroup.Option>
  )
}

export const GasSettingsOverlay: FC<GasSettingsOverlay> = ({ chainId }) => {
  const isMounted = useIsMounted()
  const [open, setOpen] = useState<boolean>(false)
  const { data } = useFeeData({
    formatUnits: 'gwei',
    chainId,
    watch: true,
  })

  const [{ gasPrice }, { updateGasPrice }] = useSettings()

  if (!isMounted) return <></>

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group items-center relative rounded-xl flex justify-between gap-3 w-full"
      >
        <div className="border-b border-transparent w-5 h-5 flex items-center justify-center">
          <GasIcon width={18} height={18} className="text-slate-500" />
        </div>
        <div className="flex gap-1 w-full justify-between items-center border-b border-slate-200/5 py-4">
          <Typography variant="sm" weight={700}>
            Gas Price
          </Typography>
          <div className="flex gap-1">
            <Typography variant="sm" className="group-hover:text-slate-200 text-slate-300">
              {gasPrice}
            </Typography>
            <div className="w-5 h-5 -mr-1.5 flex items-center">
              <ChevronRightIcon width={16} height={16} className="group-hover:text-slate-200 text-slate-300" />
            </div>
          </div>
        </div>
      </button>
      <SlideIn.FromLeft show={open} unmount={false} onClose={() => setOpen(false)} className="!mt-0">
        <Overlay.Content className="!bg-slate-800">
          <Overlay.Header onClose={() => setOpen(false)} title="Gas Settings" />
          <RadioGroup value={gasPrice} onChange={updateGasPrice} className="space-y-3">
            <GasSettingOption
              onClick={() => setOpen(false)}
              value={GasPrice.INSTANT}
              data={`${data?.formatted.gasPrice} Gwei`}
            />
            <GasSettingOption
              onClick={() => setOpen(false)}
              value={GasPrice.HIGH}
              data={`${data?.formatted.gasPrice} Gwei`}
            />
            <GasSettingOption
              onClick={() => setOpen(false)}
              value={GasPrice.MEDIUM}
              data={`${data?.formatted.gasPrice} Gwei`}
            />
            <GasSettingOption
              onClick={() => setOpen(false)}
              value={GasPrice.LOW}
              data={`${data?.formatted.gasPrice} Gwei`}
            />
          </RadioGroup>
        </Overlay.Content>
      </SlideIn.FromLeft>
    </>
  )
}
