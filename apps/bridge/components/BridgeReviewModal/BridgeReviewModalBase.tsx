import { ChevronDownIcon } from '@heroicons/react/outline'
import chains from '@sushiswap/chain'
import { ZERO } from '@sushiswap/math'
import { classNames, Dialog, NetworkIcon, SlideIn, Typography } from '@sushiswap/ui'
import { Icon } from '@sushiswap/ui/currency/Icon'
import { usePrices } from '@sushiswap/wagmi'
import React, { FC, ReactNode, useMemo } from 'react'

import { useBridgeOutput } from '../../lib/hooks'
import { useBridgeExecute } from '../BridgeExecuteProvider'
import { useBridgeState } from '../BridgeStateProvider'
import { Rate } from '../Rate'
import { Stats } from '../SwapStatsDisclosure'
import { TransactionProgressOverlay } from '../TransactionProgressOverlay'

interface BridgeReviewModalBase {
  open: boolean
  setOpen(open: boolean): void
  children: ReactNode
}

export const BridgeReviewModalBase: FC<BridgeReviewModalBase> = ({ open, setOpen, children }) => {
  const { sourceTx } = useBridgeExecute()
  const { amount, srcToken, dstToken, srcChainId, dstChainId } = useBridgeState()
  const { dstAmountOut, price } = useBridgeOutput()

  const { data: srcPrices } = usePrices({ chainId: srcChainId })
  const { data: dstPrices } = usePrices({ chainId: dstChainId })

  const srcTokenPrice = srcToken ? srcPrices?.[srcToken.wrapped.address] : undefined
  const dstTokenPrice = dstToken ? dstPrices?.[dstToken.wrapped.address] : undefined

  const [inputUsd, outputUsd, usdPctChange] = useMemo(() => {
    const inputUSD = amount && srcTokenPrice ? amount.multiply(srcTokenPrice.asFraction) : undefined
    const outputUSD = dstAmountOut && dstTokenPrice ? dstAmountOut.multiply(dstTokenPrice.asFraction) : undefined
    const usdPctChange =
      inputUSD && outputUSD && inputUSD?.greaterThan(ZERO)
        ? ((Number(outputUSD?.toExact()) - Number(inputUSD?.toExact())) / Number(inputUSD?.toExact())) * 100
        : undefined
    return [inputUSD, outputUSD, usdPctChange]
  }, [dstAmountOut, dstTokenPrice, amount, srcTokenPrice])

  return (
    <Dialog open={open} onClose={() => setOpen(false)} unmount={false}>
      <Dialog.Content className="!pb-3">
        {sourceTx?.hash ? (
          <TransactionProgressOverlay onClose={() => setOpen(false)} />
        ) : (
          <SlideIn>
            <>
              <Dialog.Header border={false} title="Confirm Swap" onClose={() => setOpen(false)} />
              <div className="!my-0 grid grid-cols-12 items-center">
                <div className="relative flex flex-col col-span-12 gap-1 p-2 border sm:p-4 rounded-2xl bg-slate-700/40 border-slate-200/5">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-between w-full gap-2">
                      <Typography variant="h3" weight={500} className="truncate text-slate-50">
                        {amount?.toSignificant(6)}{' '}
                      </Typography>
                      <div className="flex items-center justify-end gap-2 text-right">
                        {amount && (
                          <div className="w-5 h-5">
                            <Icon currency={amount.currency} width={20} height={20} />
                          </div>
                        )}
                        <Typography variant="h3" weight={500} className="text-right text-slate-50">
                          {amount?.currency.symbol}
                        </Typography>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between gap-2">
                    <Typography variant="sm" weight={500} className="text-slate-500">
                      {inputUsd ? `$${inputUsd.toFixed(2)}` : '-'}
                    </Typography>
                    {amount && (
                      <Typography variant="xs" weight={500} className="flex items-center gap-1 text-slate-400">
                        <NetworkIcon type="naked" chainId={amount.currency.chainId} width={16} height={16} />
                        <span>{chains[amount.currency.chainId].name}</span>
                      </Typography>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-center col-span-12 -mt-2.5 -mb-2.5">
                  <div className="p-0.5 bg-slate-700 border-2 border-slate-800 ring-1 ring-slate-200/5 z-10 rounded-full">
                    <ChevronDownIcon width={18} height={18} className="text-slate-200" />
                  </div>
                </div>
                <div className="flex flex-col col-span-12 gap-1 p-2 border sm:p-4 rounded-2xl bg-slate-700/40 border-slate-200/5">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-between w-full gap-2">
                      <Typography variant="h3" weight={500} className="truncate text-slate-50">
                        {dstAmountOut?.toSignificant(6)}{' '}
                      </Typography>
                      <div className="flex items-center justify-end gap-2 text-right">
                        {dstAmountOut && (
                          <div className="w-5 h-5">
                            <Icon currency={dstAmountOut.currency} width={20} height={20} />
                          </div>
                        )}
                        <Typography variant="h3" weight={500} className="text-right text-slate-50">
                          {dstAmountOut?.currency.symbol}
                        </Typography>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between gap-2">
                    <Typography variant="sm" weight={500} className="text-slate-500">
                      {outputUsd ? `$${outputUsd.toFixed(2)}` : ''}
                      {usdPctChange && (
                        <span
                          className={classNames(
                            usdPctChange === 0
                              ? ''
                              : usdPctChange > 0
                              ? 'text-green'
                              : usdPctChange < -3
                              ? 'text-red'
                              : usdPctChange < -2
                              ? 'text-yellow'
                              : 'text-slate-500'
                          )}
                        >
                          {' '}
                          {`${usdPctChange === 0 ? '' : usdPctChange > 0 ? '(+' : '('}${
                            usdPctChange === 0 ? '0.00' : usdPctChange?.toFixed(2)
                          }%)`}
                        </span>
                      )}
                    </Typography>
                    {dstAmountOut && (
                      <Typography variant="xs" weight={500} className="flex items-center gap-1 text-slate-400">
                        <NetworkIcon type="naked" chainId={dstAmountOut.currency.chainId} width={16} height={16} />
                        <span>{chains[dstAmountOut.currency.chainId].name}</span>
                      </Typography>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-center px-4 py-3">
                <Rate price={price}>
                  {({ toggleInvert, content, usdPrice }) => (
                    <Typography
                      as="button"
                      onClick={() => toggleInvert()}
                      variant="sm"
                      weight={600}
                      className="flex items-center gap-1 text-slate-100"
                    >
                      {content} {usdPrice && <span className="font-normal text-slate-300">(${usdPrice})</span>}
                    </Typography>
                  )}
                </Rate>
              </div>
              <div className="grid grid-cols-2 gap-1 p-2 border rounded-2xl sm:p-4 border-slate-200/5 bg-slate-700/40">
                <Stats />
              </div>
              {children}
            </>
          </SlideIn>
        )}
      </Dialog.Content>
    </Dialog>
  )
}
