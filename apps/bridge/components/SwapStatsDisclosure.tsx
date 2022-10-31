import { Disclosure, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { Native, WNATIVE_ADDRESS } from '@sushiswap/currency'
import { useIsMounted } from '@sushiswap/hooks'
import { STARGATE_CONFIRMATION_SECONDS } from '@sushiswap/stargate'
import { classNames, Loader, Typography } from '@sushiswap/ui'
import { Collapsible } from '@sushiswap/ui/animation/Collapsible/Collapsible'
import { usePrices } from '@sushiswap/wagmi'
import React, { FC } from 'react'

import { useBridgeState, useDerivedBridgeState } from './BridgeStateProvider'

export const SwapStatsDisclosure: FC = () => {
  const { srcChainId, srcTypedAmount } = useBridgeState()
  return (
    <Collapsible open={Boolean(srcTypedAmount)}>
      <div className="p-3 pb-1">
        <Disclosure>
          {({ open }) => (
            <>
              <div className="flex justify-between items-center bg-white bg-opacity-[0.04] hover:bg-opacity-[0.08] rounded-2xl px-4 mb-4 py-2.5 gap-2">
                <Typography variant="sm" className="text-slate-400">
                  Est. Processing Time
                </Typography>
                <Typography variant="sm" weight={500} className="text-right truncate text-slate-200">
                  ~
                  {Math.ceil(
                    STARGATE_CONFIRMATION_SECONDS[srcChainId as keyof typeof STARGATE_CONFIRMATION_SECONDS] / 60
                  )}{' '}
                  minutes
                </Typography>
                <Disclosure.Button className="flex items-center justify-end flex-grow cursor-pointer">
                  <ChevronDownIcon
                    width={24}
                    height={24}
                    className={classNames(
                      open ? '!rotate-180' : '',
                      'rotate-0 transition-[transform] duration-300 ease-in-out delay-200'
                    )}
                  />
                </Disclosure.Button>
              </div>
              <Transition
                show={open}
                unmount={false}
                className="transition-[max-height] overflow-hidden"
                enter="duration-300 ease-in-out"
                enterFrom="transform max-h-0"
                enterTo="transform max-h-[380px]"
                leave="transition-[max-height] duration-250 ease-in-out"
                leaveFrom="transform max-h-[380px]"
                leaveTo="transform max-h-0"
              >
                <Disclosure.Panel
                  as="div"
                  className="grid grid-cols-2 gap-1 px-4 py-2 mb-4 border border-slate-200/5 rounded-2xl"
                  unmount={false}
                >
                  <Stats />
                </Disclosure.Panel>
              </Transition>
            </>
          )}
        </Disclosure>
      </div>
    </Collapsible>
  )
}

export const Stats: FC = () => {
  const isMounted = useIsMounted()
  const { bridgeFee, isLoading } = useDerivedBridgeState()
  const { srcChainId, srcToken, gasFee } = useBridgeState()
  const { data: srcPrices } = usePrices({ chainId: srcChainId })

  return (
    <>
      <Typography variant="sm" className="text-slate-400">
        Est. Processing Time
      </Typography>
      <Typography variant="sm" weight={500} className="text-right truncate text-slate-200">
        ~{Math.ceil(STARGATE_CONFIRMATION_SECONDS[srcChainId as keyof typeof STARGATE_CONFIRMATION_SECONDS] / 60)}{' '}
        minutes
      </Typography>
      <Typography variant="sm" className="text-slate-400">
        Bridge Fee
      </Typography>
      {bridgeFee && srcToken && srcPrices?.[srcToken.wrapped.address] ? (
        <Typography variant="sm" weight={500} className="text-right truncate text-slate-400">
          ~$
          {bridgeFee?.greaterThan(0)
            ? bridgeFee?.multiply(srcPrices[srcToken.wrapped.address].asFraction)?.toSignificant(6)
            : 0}
        </Typography>
      ) : isLoading && isMounted ? (
        <div className="flex items-center justify-end">
          <Loader size={14} />
        </div>
      ) : (
        <Typography variant="sm" weight={500} className="text-right truncate text-slate-400">
          $0.00
        </Typography>
      )}
      <Typography variant="sm" className="text-slate-400">
        Gas Cost
      </Typography>
      {gasFee &&
      srcPrices &&
      Boolean(srcChainId && srcChainId in WNATIVE_ADDRESS && WNATIVE_ADDRESS[srcChainId] in srcPrices) ? (
        <Typography variant="sm" weight={500} className="text-right truncate text-slate-400">
          {gasFee.toSignificant(6)} {Native.onChain(srcChainId).symbol}
        </Typography>
      ) : (
        <div className="flex items-center justify-end">
          <Loader size={14} />
        </div>
      )}
    </>
  )
}
