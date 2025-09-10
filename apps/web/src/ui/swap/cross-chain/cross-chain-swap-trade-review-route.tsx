'use client'

import { classNames } from '@sushiswap/ui'
import React from 'react'
import { getEvmChainById } from 'sushi/evm'
import {
  useDerivedStateCrossChainSwap,
  useSelectedCrossChainTradeRoute,
} from './derivedstate-cross-chain-swap-provider'

export const CrossChainSwapTradeReviewRoute = () => {
  const {
    state: { chainId0 },
  } = useDerivedStateCrossChainSwap()
  const { data: trade } = useSelectedCrossChainTradeRoute()

  return (
    <div
      className={classNames(
        'px-3 flex w-full',
        trade?.step.includedStepsWithoutFees.length === 1
          ? 'justify-center'
          : 'justify-between',
      )}
    >
      {trade?.step?.type === 'lifi' &&
        trade.step.includedStepsWithoutFees.map((step, i) => {
          return (
            <React.Fragment key={`step:${i}`}>
              {i > 0 ? (
                <div className="flex-1 flex items-center opacity-20 -ml-1 gap-1">
                  <span className="bg-blue w-2 h-2 rounded-full" />
                  <span className="flex-1 bg-blue w-3 h-0.5 rounded-md" />
                  <span className="bg-blue w-2 h-2 rounded-full" />
                </div>
              ) : null}
              {step.type === 'swap' ? (
                <div className="p-3 flex flex-col gap-2.5 overflow-hidden">
                  <span className="text-[10px] text-muted-foreground overflow-hidden overflow-ellipsis whitespace-nowrap">
                    {step.action.fromChainId === chainId0 ? 'From' : 'To'}:{' '}
                    {getEvmChainById(
                      step.action.fromChainId,
                    ).name.toUpperCase()}
                  </span>

                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-medium overflow-hidden overflow-ellipsis whitespace-nowrap">
                      Swap {step.action.fromToken.symbol} to{' '}
                      {step.action.toToken.symbol}
                    </span>
                  </div>
                </div>
              ) : step.type === 'cross' ? (
                <div className="p-3 flex flex-col gap-2.5 items-center overflow-hidden">
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                    Via{' '}
                    <img
                      src={step.toolDetails.logoURI}
                      className="rounded-full"
                      width={10}
                      height={10}
                      alt={step.toolDetails.name}
                    />{' '}
                    <span className="font-semibold">
                      {step.toolDetails.name}
                    </span>
                  </span>
                  <span className="text-xs font-medium overflow-hidden overflow-ellipsis whitespace-nowrap">
                    Bridge {step.action.fromToken.symbol}
                  </span>
                </div>
              ) : null}
            </React.Fragment>
          )
        })}
    </div>
  )
}
