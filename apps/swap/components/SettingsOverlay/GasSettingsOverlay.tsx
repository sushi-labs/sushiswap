import { RadioGroup, Transition } from '@headlessui/react'
import { ChevronRightIcon, InformationCircleIcon } from '@heroicons/react/outline'
import { CheckCircleIcon, StarIcon } from '@heroicons/react/solid'
import { ChainId } from '@sushiswap/chain'
import { useIsMounted } from '@sushiswap/hooks'
import { CircleIcon, classNames, GasIcon, Input, Overlay, Popover, SlideIn, Typography } from '@sushiswap/ui'
import { FC, useState } from 'react'
import { useFeeData } from 'wagmi'

import { GasPrice, useSettings } from '../../lib/state/settings'

interface GasSettingsOverlay {
  chainId: ChainId | undefined
}

export const GasSettingOption: FC<{ recommended?: boolean; onClick?(): void; value: GasPrice; data: string }> = ({
  recommended,
  onClick,
  value,
  data,
}) => {
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
          <div className="absolute right-2 top-2">
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
            <Typography variant="sm" weight={700} className="flex gap-1 items-center">
              {value} {recommended && <StarIcon className="text-blue" width={12} height={12} />}
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

export const AdvancedGasSettings: FC<{ onClick(): void }> = ({ onClick }) => {
  const [hover, setHover] = useState<boolean>(false)
  const [{ maxPriorityFeePerGas, maxFeePerGas, gasType }, { updateMaxPriorityFeePerGas, updateMaxFeePerGas }] =
    useSettings()

  const checked = gasType === 'custom'

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={classNames(
        checked ? 'ring-2 !ring-blue-500/40 border-blue' : '',
        'border-2 border-slate-700 hover:border-blue transform-all duration-400 bg-slate-700 active:ring-3 rounded-lg relative px-3 py-2'
      )}
    >
      <div className="flex items-center gap-2">
        <div className="absolute right-2 top-2">
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
              <CheckCircleIcon
                className="cursor-pointer text-blue hover:scale-[1.10]"
                width={24}
                height={24}
                onClick={onClick}
              />
            ) : (
              <div className="cursor-pointer w-6 h-6 flex justify-center items-center" onClick={onClick}>
                <CircleIcon className="text-blue hover:scale-[1.10]" width={22} height={22} />
              </div>
            )}
          </Transition>
        </div>
        <div className="flex flex-col gap-3 pb-2">
          <Typography variant="sm" weight={700}>
            Custom
          </Typography>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-600 rounded-xl flex flex-col gap-2 px-3 py-2">
              <Typography variant="xs" weight={700} className="text-slate-300 flex items-center gap-1">
                Max Priority Fee
                <Popover
                  hover
                  arrow={false}
                  button={<InformationCircleIcon width={14} height={14} />}
                  panel={
                    <Typography variant="xs" weight={700} className="bg-slate-600 !rounded-lg w-40 p-3">
                      This fee goes directly to miners as an incentive to prioritize your transaction
                    </Typography>
                  }
                />
              </Typography>
              <div className="flex gap-2 items-center">
                <Input.Numeric
                  value={maxPriorityFeePerGas ?? ''}
                  onUserInput={(val) => updateMaxPriorityFeePerGas(+val)}
                  placeholder=""
                  className="flex font-bold text-sm w-full !py-0"
                />
                <Typography variant="xs" weight={700} className="text-slate-400">
                  Gwei
                </Typography>
              </div>
            </div>
            <div className="bg-slate-600 rounded-xl flex flex-col gap-2 px-3 py-2">
              <Typography variant="xs" weight={700} className="text-slate-300 flex items-center gap-1">
                Max Fee
                <Popover
                  hover
                  arrow={false}
                  button={<InformationCircleIcon width={14} height={14} />}
                  panel={
                    <div className="bg-slate-600 !rounded-lg w-40 flex flex-col gap-2 p-3">
                      <Typography variant="xs" weight={700}>
                        The max fee is the highest gas price that might be applied for your transaction.
                      </Typography>
                      <Typography variant="xs" weight={700}>
                        It&apos;s sum of base fee and priority fee.
                      </Typography>
                    </div>
                  }
                />
              </Typography>
              <div className="flex gap-2 items-center">
                <Input.Numeric
                  value={maxFeePerGas ?? ''}
                  onUserInput={(val) => updateMaxFeePerGas(+val)}
                  placeholder=""
                  className="flex font-bold text-sm w-full !py-0"
                />
                <Typography variant="xs" weight={700} className="text-slate-400">
                  Gwei
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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

  const [{ gasPrice, gasType }, { updateGasPrice, updateGasType }] = useSettings()

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
              {gasType == 'preset' ? gasPrice : 'Custom'}
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
          <RadioGroup
            value={gasType === 'preset' ? gasPrice : undefined}
            onChange={updateGasPrice}
            className="gap-3 grid grid-cols-2"
          >
            <GasSettingOption
              onClick={() => setOpen(false)}
              value={GasPrice.INSTANT}
              data={`${data?.formatted.gasPrice} Gwei`}
            />
            <GasSettingOption
              recommended
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
          <AdvancedGasSettings
            onClick={() => {
              updateGasType('custom')
              setOpen(false)
            }}
          />
        </Overlay.Content>
      </SlideIn.FromLeft>
    </>
  )
}
