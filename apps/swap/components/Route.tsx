import { ArrowNarrowDownIcon } from '@heroicons/react/outline'
import { ChevronRightIcon, DotsHorizontalIcon } from '@heroicons/react/solid'
import chain from '@sushiswap/chain'
import { Amount, Token, Type } from '@sushiswap/currency'
import { STARGATE_TOKEN } from '@sushiswap/stargate'
import { Currency, Link, NetworkIcon, Popover, Typography } from '@sushiswap/ui'
import { Icon } from '@sushiswap/ui/currency/Icon'
import { FC } from 'react'

import { UseTradeOutput } from '../lib/hooks'

interface CrossChainRoute {
  srcTrade?: UseTradeOutput
  dstTrade?: UseTradeOutput
  inputAmount?: Amount<Type>
  outputAmount?: Amount<Type>
  srcBridgeToken: Token
  dstBridgeToken: Token
}

export const CrossChainRoute: FC<CrossChainRoute> = ({
  srcTrade,
  dstTrade,
  inputAmount,
  outputAmount,
  srcBridgeToken,
  dstBridgeToken,
}) => {
  if (!inputAmount || !outputAmount) return <></>

  return (
    <>
      <Typography variant="sm" className="text-slate-400">
        Optimized Route
      </Typography>
      <div className="flex justify-end">
        <Popover
          hover
          panel={
            <div className="bg-slate-800 space-y-2 p-3 rounded-2xl border-slate-200/10 border">
              <div className="bg-slate-700/40 flex flex-col gap-4 border border-dashed rounded-xl border-slate-600 px-4 py-3">
                <Typography variant="xs" className="flex items-center gap-1">
                  <NetworkIcon type="naked" width={16} height={16} chainId={inputAmount.currency.chainId} />
                  {chain[inputAmount.currency.chainId].name}
                </Typography>
                <div className="flex justify-center items-center">
                  {srcTrade ? (
                    <div className="relative flex gap-4 items-center">
                      <div className="flex flex-col gap-1">
                        <Currency.Icon currency={srcTrade.inputAmount.currency} width={28} height={28} />
                      </div>
                      <ChevronRightIcon width={20} height={20} className="text-slate-400" />
                      <Typography variant="sm" weight={500} className="flex flex-col text-center">
                        {srcTrade.isV1() ? 'Classic Pool' : 'Trident Pool'}
                      </Typography>
                      <ChevronRightIcon width={20} height={20} className="text-slate-400" />
                      <div className="flex flex-col gap-1">
                        <Currency.Icon currency={srcTrade.outputAmount.currency} width={28} height={28} />
                      </div>
                    </div>
                  ) : (
                    <Currency.Icon currency={inputAmount.currency} width={28} height={28} />
                  )}
                </div>
              </div>
              <div className="flex items-center justify-center">
                <ArrowNarrowDownIcon width={18} height={18} className="text-slate-500" />
              </div>
              <div className="flex items-center justify-center">
                <div className="flex gap-2 py-2 px-6 border rounded-full bg-slate-700/40  border-slate-600">
                  <Typography weight={500} variant="xs" className="text-slate-300">
                    Bridged By
                  </Typography>
                  <div className="flex gap-1 items-center">
                    <div className="w-[18px] h-[18px]">
                      <Icon currency={STARGATE_TOKEN} width={18} height={18} />
                    </div>
                    <Typography weight={500} variant="xs" className="text-slate-300">
                      <Link.External href="https://stargate.finance">Stargate</Link.External>
                    </Typography>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <ArrowNarrowDownIcon width={18} height={18} className="text-slate-500" />
              </div>
              <div className="bg-slate-700/40 flex flex-col gap-4 border border-dashed rounded-xl border-slate-600 px-4 py-3">
                <Typography variant="xs" className="flex items-center gap-1">
                  <NetworkIcon type="naked" width={16} height={16} chainId={outputAmount.currency.chainId} />
                  {chain[outputAmount.currency.chainId].name}
                </Typography>
                <div className="flex justify-center items-center">
                  {dstTrade ? (
                    <div className="relative flex gap-4 items-center">
                      <div className="flex flex-col gap-1">
                        <Currency.Icon currency={dstTrade.inputAmount.currency} width={28} height={28} />
                      </div>
                      <ChevronRightIcon width={20} height={20} className="text-slate-400" />
                      <Typography variant="sm" weight={500} className="flex flex-col text-center">
                        {dstTrade.isV1() ? 'Classic Pool' : 'Trident Pool'}
                      </Typography>
                      <ChevronRightIcon width={20} height={20} className="text-slate-400" />
                      <div className="flex flex-col gap-1">
                        <Currency.Icon currency={dstTrade.outputAmount.currency} width={28} height={28} />
                      </div>
                    </div>
                  ) : (
                    <Currency.Icon currency={outputAmount.currency} width={28} height={28} />
                  )}
                </div>
              </div>
            </div>
          }
          button={
            <Typography as="button" variant="sm" weight={500} className="cursor-pointer text-blue text-right">
              View Route
            </Typography>
          }
        />
      </div>
    </>
  )
}

interface SameChainRoute {
  trade: UseTradeOutput
}

// Can render an entire tines single route with dots between
export const SingleRoute: FC<{ trade: UseTradeOutput }> = ({ trade }) => {
  if (!trade) return <></>
  return (
    <div className="relative flex">
      {trade.route.legs.map((leg, i) => (
        <div key={i} className="z-10 flex items-center text-xs font-medium leading-4 text-slate-300">
          {i === 0 ? (
            <Typography variant="xs" weight={700}>
              {leg.tokenFrom.symbol}
            </Typography>
          ) : null}

          <DotsHorizontalIcon width={12} className="text-slate-600" />

          <Typography variant="xs" weight={700}>
            {leg.tokenTo.symbol}
          </Typography>
        </div>
      ))}
    </div>
  )
}

// Can render a tines multi route
export const ComplexRoute: FC<{ trade: UseTradeOutput }> = ({ trade }) => {
  if (!trade) return <></>
  const initialPaths = trade.route.legs.filter(
    (leg) => leg.tokenFrom.address === trade.inputAmount.currency.wrapped.address
  )
  const percentPaths = trade.route.legs.filter(
    (leg) => leg.tokenFrom.address !== trade.inputAmount.currency.wrapped.address
  )
  console.log('initial paths length', initialPaths.length)

  console.log('remaining paths length', trade.route.legs.length - initialPaths.length)
  // TODO: Figure out what would make sense here...
  return (
    <>
      {initialPaths.map((initialPath, i) => (
        <div key={i} className="z-10 flex items-center text-xs font-medium leading-4 text-slate-300">
          {Number(initialPath.absolutePortion * 100).toFixed(2)}%
          <DotsHorizontalIcon width={12} className="text-slate-600" />
          <Typography variant="xs" weight={700}>
            {initialPath.tokenFrom.symbol}
          </Typography>
          <DotsHorizontalIcon width={12} className="text-slate-600" />
          {initialPath.poolFee * 100}%
          <DotsHorizontalIcon width={12} className="text-slate-600" />
          <Typography variant="xs" weight={700}>
            {initialPath.tokenTo.symbol}
          </Typography>
        </div>
      ))}
      {percentPaths.map((percentPath, i) => (
        <div key={i} className="z-10 flex items-center text-xs font-medium leading-4 text-slate-300">
          {Number(percentPath.absolutePortion * 100).toFixed(2)}%
          <DotsHorizontalIcon width={12} className="text-slate-600" />
          <Typography variant="xs" weight={700}>
            {percentPath.tokenFrom.symbol}
          </Typography>
          <DotsHorizontalIcon width={12} className="text-slate-600" />
          {percentPath.poolFee * 100}%
          <DotsHorizontalIcon width={12} className="text-slate-600" />
          <Typography variant="xs" weight={700}>
            {percentPath.tokenTo.symbol}
          </Typography>
        </div>
      ))}
    </>
  )
}

export const SameChainRoute: FC<SameChainRoute> = ({ trade }) => {
  if (!trade) return <></>

  return (
    <>
      <div className="flex justify-between gap-2">
        <Typography variant="xs" className="text-slate-400">
          Optimized Route
        </Typography>
        {trade.isSingle() && <SingleRoute trade={trade} />}
        {trade.isComplex() && <ComplexRoute trade={trade} />}
      </div>
    </>
  )
}
