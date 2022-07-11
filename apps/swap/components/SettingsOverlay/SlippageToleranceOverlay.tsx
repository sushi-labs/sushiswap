import { RadioGroup, Transition } from '@headlessui/react'
import { AdjustmentsIcon, ChevronRightIcon } from '@heroicons/react/outline'
import { CheckCircleIcon, StarIcon } from '@heroicons/react/solid'
import { useIsMounted } from '@sushiswap/hooks'
import { CircleIcon, classNames, DEFAULT_INPUT_UNSTYLED, Input, Overlay, SlideIn, Typography } from '@sushiswap/ui'
import { FC, useCallback, useRef, useState } from 'react'

import { useSettings } from '../../lib/state/storage'

export const SlippageSettingOption: FC<{ recommended?: boolean; onClick?(): void; value: number; data: string }> = ({
  onClick,
  value,
  data,
  recommended,
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
              {value}% {recommended && <StarIcon className="text-blue" width={12} height={12} />}
            </Typography>
            <Typography variant="xxs" className="text-slate-400">
              {data}
            </Typography>
          </div>
        </div>
      )}
    </RadioGroup.Option>
  )
}

export const SlippageToleranceOverlay = () => {
  const isMounted = useIsMounted()
  const inputRef = useRef<HTMLInputElement>(null)
  const [customHover, setCustomHover] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const [{ slippageTolerance }, { updateSlippageTolerance }] = useSettings()

  const handleClose = useCallback(() => {
    setTimeout(() => setOpen(false), 300)
  }, [])

  if (!isMounted) return <></>

  const custom = ![0.1, 0.5, 1, 3].includes(slippageTolerance)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group items-center relative rounded-xl flex justify-between gap-3 w-full"
      >
        <div className="border-b border-transparent w-5 h-5 flex items-center justify-center">
          <AdjustmentsIcon width={20} height={20} className="-ml-0.5 text-slate-500" />
        </div>
        <div className="flex gap-1 w-full justify-between items-center border-b border-slate-200/5 py-4">
          <Typography variant="sm" weight={700}>
            Slippage Tolerance
          </Typography>
          <div className="flex gap-1">
            <Typography variant="sm" className="group-hover:text-slate-200 text-slate-300">
              {slippageTolerance}%
            </Typography>
            <div className="w-5 h-5 -mr-1.5 flex items-center">
              <ChevronRightIcon width={16} height={16} className="group-hover:text-slate-200 text-slate-300" />
            </div>
          </div>
        </div>
      </button>
      <SlideIn.FromLeft show={open} onClose={handleClose} className="!mt-0">
        <Overlay.Content className="!bg-slate-800 !pt-[56px]">
          <Overlay.Header onClose={() => setOpen(false)} title="Slippage Tolerance" />
          <Typography variant="xs" className="text-slate-400 text-center mb-2">
            Your transaction will revert if the prices change unfavorably by more than this percentage
          </Typography>
          <RadioGroup value={slippageTolerance} onChange={updateSlippageTolerance} className="gap-3 grid grid-cols-2">
            <SlippageSettingOption
              onClick={handleClose}
              value={0.1}
              data="Good for highly liquid pairs with low volatility"
            />
            <SlippageSettingOption onClick={handleClose} value={0.5} data="Good for highly liquid pairs" />
            <SlippageSettingOption recommended onClick={handleClose} value={1} data="Recommended for most pairs" />
            <SlippageSettingOption onClick={handleClose} value={3} data="Recommended for low liquidity pairs" />
          </RadioGroup>
          <div
            onClick={() => inputRef.current?.focus()}
            className={classNames(
              custom ? 'ring-2 !ring-blue-500/40 border-blue' : '',
              'mt-3 cursor-text border-2 border-slate-700 hover:border-blue transform-all duration-400 bg-slate-700 active:ring-3 rounded-lg relative pl-3 py-2 pr-10'
            )}
            onMouseEnter={() => setCustomHover(true)}
            onMouseLeave={() => setCustomHover(false)}
          >
            <div className="flex items-center">
              <div className="absolute right-2 top-2">
                <Transition
                  show={customHover || custom}
                  enter="transition-all duration-150"
                  enterFrom="scale-[.25]"
                  enterTo="scale-100"
                  leave="transition-opacity duration-150"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  {custom ? (
                    <CheckCircleIcon
                      className="cursor-pointer text-blue hover:scale-[1.10] transform-all"
                      width={24}
                      height={24}
                      onClick={handleClose}
                    />
                  ) : (
                    <div
                      className="cursor-pointer w-6 h-6 flex justify-center items-center"
                      onClick={() => {
                        if (inputRef.current?.value) {
                          updateSlippageTolerance(+inputRef.current.value)
                          setOpen(false)
                        }
                      }}
                    >
                      <CircleIcon className="text-blue hover:scale-[1.10] transform-all" width={22} height={22} />
                    </div>
                  )}
                </Transition>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <Typography variant="sm" weight={700} className="flex gap-2 items-baseline">
                  Custom{' '}
                  {slippageTolerance > 3 && (
                    <span className="text-yellow text-xs">Your transaction may be frontrun</span>
                  )}
                </Typography>
                <Input.Numeric
                  variant="unstyled"
                  ref={inputRef}
                  placeholder="5"
                  onUserInput={(val) => updateSlippageTolerance(+val)}
                  className={classNames(DEFAULT_INPUT_UNSTYLED, 'py-0.5')}
                />
              </div>
            </div>
          </div>
        </Overlay.Content>
      </SlideIn.FromLeft>
    </>
  )
}
