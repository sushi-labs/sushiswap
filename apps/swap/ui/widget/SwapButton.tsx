'use client'

import { Button } from '@sushiswap/ui13/components/button'
import React, { FC, Fragment } from 'react'
import { useSwapActions, useSwapState } from '../trade/TradeProvider'
import { ApprovalState, ApproveTokenController, Checker } from '@sushiswap/wagmi13'
import { ChainId } from '@sushiswap/chain'
import { FixedButtonContainer } from '../FixedButtonContainer'
import { useTrade } from '../../lib/useTrade'
import { Native } from '@sushiswap/currency'
import { AppType } from '@sushiswap/ui13/types'
import { getRouteProcessorAddressForChainId } from 'lib/getRouteProcessorAddressForChainId'
import { Popover, Transition } from '@headlessui/react'
import { ChevronRightIcon } from '@heroicons/react/24/outline'

export const SwapButton: FC = () => {
  const { appType, amount, network0, value, token0, token1 } = useSwapState()
  const { isFetching, isLoading } = useTrade()
  const { setReview } = useSwapActions()

  const isWrap =
    appType === AppType.Swap && token0.isNative && token1.wrapped.address === Native.onChain(network0).wrapped.address
  const isUnwrap =
    appType === AppType.Swap && token1.isNative && token0.wrapped.address === Native.onChain(network0).wrapped.address

  return (
    <ApproveTokenController amount={amount} contract={getRouteProcessorAddressForChainId(ChainId.POLYGON)}>
      {({ approvalState }) => (
        <FixedButtonContainer>
          {approvalState === ApprovalState.NOT_APPROVED && (
            <Popover className="relative flex justify-center">
              <Popover.Button className="text-center text-xs text-blue cursor-pointer">
                What is an approval?
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="border border-gray-300 dark:border-slate-700 dark:text-slate-200 absolute flex flex-col gap-3 bottom-7 bg-white dark:bg-slate-800 rounded-lg shadow-md px-4 py-3 text-xs mt-0.5">
                  <span className="text-gray-500 dark:text-slate-400">Token Approval</span>
                  We need your approval to execute this transaction on your behalf; you will only have to approve the{' '}
                  {amount?.currency.symbol} contract once.
                  <a
                    target="_blank"
                    className="text-blue dark:text-blue dark:font-semibold flex gap-1 items-center"
                    href="https://www.sushi.com/academy/articles/what-is-token-approval"
                    rel="noreferrer"
                  >
                    Learn more <ChevronRightIcon width={12} height={12} />
                  </a>
                </Popover.Panel>
              </Transition>
            </Popover>
          )}
          <Checker.Network fullWidth size="xl" chainId={ChainId.POLYGON}>
            <Checker.Amounts fullWidth size="xl" chainId={network0} amounts={[amount]}>
              <Checker.ApproveERC20
                id="approve-erc20"
                fullWidth
                size="xl"
                amount={amount}
                contract={getRouteProcessorAddressForChainId(ChainId.POLYGON)}
              >
                <Button
                  disabled={Boolean(isLoading && +value > 0) || isFetching}
                  fullWidth
                  size="xl"
                  onClick={() => setReview(true)}
                >
                  {isWrap ? 'Wrap' : isUnwrap ? 'Unwrap' : 'Swap'}
                </Button>
              </Checker.ApproveERC20>
            </Checker.Amounts>
          </Checker.Network>
        </FixedButtonContainer>
      )}
    </ApproveTokenController>
  )
}
