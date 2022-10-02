import { DotsHorizontalIcon } from '@heroicons/react/solid'
import { AppearOnMount, Currency, Typography } from '@sushiswap/ui'
import { TradeOutput } from '@sushiswap/wagmi'
import { FC } from 'react'

import { useTrade } from './TradeProvider'

// Can render an entire tines single route with dots between
export const SingleRoute: FC<{ trade: TradeOutput }> = ({ trade }) => {
  if (!trade) return <></>
  return (
    <div className="grid items-center grid-flow-col gap-4">
      <div className="z-10 flex items-center gap-4 p-2 text-xs font-medium leading-4 shadow shadow-slate-900 text-slate-300 bg-slate-800 rounded-2xl">
        <div className="w-6 h-6">
          <Currency.Icon currency={trade.inputAmount.currency} width={24} height={24} />
        </div>
      </div>
      <DotsHorizontalIcon width={12} className="text-slate-600" />
      {trade.route.legs.map((leg) => (
        <>
          <div className="z-10 flex items-center gap-4 p-2 text-xs font-medium leading-4 shadow shadow-slate-900 text-slate-300 bg-slate-800 rounded-2xl">
            <Typography variant="xs" weight={500}>
              {leg.tokenFrom.symbol}/{leg.tokenTo.symbol} {leg.poolFee * 100}%
            </Typography>
          </div>
        </>
      ))}
      <DotsHorizontalIcon width={12} className="text-slate-600" />
      <div className="z-10 flex items-center gap-4 p-2 text-xs font-medium leading-4 shadow shadow-slate-900 text-slate-300 bg-slate-800 rounded-2xl">
        <div className="w-6 h-6">
          <Currency.Icon currency={trade.outputAmount.currency} width={24} height={24} />
        </div>
      </div>
    </div>
  )
}

// Can render a tines multi route
export const ComplexRoute: FC<{ trade: TradeOutput }> = ({ trade }) => {
  if (!trade) return <></>

  const directPaths = trade.route.legs.filter(
    (leg) =>
      leg.tokenFrom.address === trade.inputAmount.currency.wrapped.address &&
      leg.tokenTo.address === trade.outputAmount.currency.wrapped.address
  )

  const initialPaths = trade.route.legs.filter(
    (leg) =>
      leg.tokenFrom.address === trade.inputAmount.currency.wrapped.address &&
      leg.tokenTo.address !== trade.outputAmount.currency.wrapped.address
  )

  const percentPaths = trade.route.legs.filter(
    (leg) =>
      leg.tokenFrom.address !== trade.inputAmount.currency.wrapped.address &&
      leg.tokenTo.address !== trade.outputAmount.currency.wrapped.address
  )

  const finalPaths = trade.route.legs.filter(
    (leg) =>
      leg.tokenFrom.address !== trade.inputAmount.currency.wrapped.address &&
      leg.tokenTo.address === trade.outputAmount.currency.wrapped.address
  )
  return (
    <>
      <div className="grid items-center grid-flow-col gap-4">
        <div className="space-y-2">
          <div className="z-10 flex items-center gap-4 p-2 text-xs font-medium leading-4 shadow shadow-slate-900 text-slate-300 bg-slate-800 rounded-2xl">
            <div className="w-6 h-6">
              <Currency.Icon currency={trade.inputAmount.currency} width={24} height={24} />
            </div>
          </div>
        </div>
        <div className="grid items-center grid-flow-row gap-4">
          <div>
            <div className="grid items-center grid-flow-col gap-4 grid-col-4">
              <div className="space-y-2">
                {initialPaths.map((initialPath, i) => (
                  <div
                    key={i}
                    className="z-10 flex items-center justify-between gap-4 p-2 text-xs font-medium leading-4 shadow shadow-slate-900 text-slate-300 bg-slate-800 rounded-2xl"
                  >
                    {Number(initialPath.absolutePortion * 100).toFixed(2)}%
                    <DotsHorizontalIcon width={12} className="text-slate-600" />
                    <Typography variant="xs" weight={500}>
                      {initialPath.tokenFrom.symbol}/{initialPath.tokenTo.symbol} {initialPath.poolFee * 100}%
                    </Typography>
                    <DotsHorizontalIcon width={12} className="text-slate-600" />
                    <Typography variant="xs" weight={500}>
                      {initialPath.tokenTo.symbol}
                    </Typography>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {percentPaths.map((percentagePath, i) => (
                  <div
                    key={i}
                    className="z-10 grid items-center justify-between grid-flow-col gap-4 p-2 text-xs font-medium leading-4 shadow shadow-slate-900 text-slate-300 bg-slate-800 rounded-2xl"
                  >
                    {Number(percentagePath.absolutePortion * 100).toFixed(2)}%
                    <DotsHorizontalIcon width={12} className="text-slate-600" />
                    <Typography variant="xs" weight={500}>
                      {percentagePath.tokenFrom.symbol}/{percentagePath.tokenTo.symbol} {percentagePath.poolFee * 100}%
                    </Typography>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {finalPaths.map((finalPath, i) => (
                  <div
                    key={i}
                    className="z-10 grid items-center justify-between grid-flow-col gap-4 p-2 text-xs font-medium leading-4 shadow shadow-slate-900 text-slate-300 bg-slate-800 rounded-2xl"
                  >
                    {Number(finalPath.absolutePortion * 100).toFixed(2)}%
                    <DotsHorizontalIcon width={12} className="text-slate-600" />
                    <Typography variant="xs" weight={500}>
                      {finalPath.tokenFrom.symbol}/{finalPath.tokenTo.symbol} {finalPath.poolFee * 100}%
                    </Typography>
                    <DotsHorizontalIcon width={12} className="text-slate-600" />
                    <Typography variant="xs" weight={500}>
                      {finalPath.tokenTo.symbol}
                    </Typography>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {directPaths.map((directPath, i) => (
            <div key={i} className="flex gap-4">
              <div className="z-10 flex items-center justify-between flex-grow p-2 mx-auto text-xs font-medium leading-4 shadow shadow-slate-900 text-slate-300 bg-slate-800 rounded-2xl">
                {Number(directPath.absolutePortion * 100).toFixed(2)}%
                <DotsHorizontalIcon width={12} className="text-slate-600" />
                <Typography variant="xs" weight={500}>
                  {directPath.tokenFrom.symbol}/{directPath.tokenTo.symbol}
                  {directPath.poolFee * 100}%
                </Typography>
                <DotsHorizontalIcon width={12} className="text-slate-600" />
                <Typography variant="xs" weight={500}>
                  {directPath.tokenTo.symbol}
                </Typography>
              </div>
            </div>
          ))}
        </div>
        <div>
          <div className="z-10 flex items-center gap-4 p-2 text-xs font-medium leading-4 shadow shadow-slate-900 text-slate-300 bg-slate-800 rounded-2xl">
            <div className="w-6 h-6">
              <Currency.Icon currency={trade.outputAmount.currency} width={24} height={24} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export const Route: FC = () => {
  const { trade } = useTrade()
  if (!trade) return <></>

  return (
    <AppearOnMount>
      <div className="flex flex-col gap-4">
        <div className="flex justify-end">
          {trade.isSingle() && <SingleRoute trade={trade} />}
          {trade.isComplex() && <ComplexRoute trade={trade} />}
          {/* {trade.isComplex() && (
          <Tooltip
            panel={<div className="flex flex-col gap-1">{<ComplexRoute trade={trade} />}</div>}
            button={
              <Typography variant="sm" weight={500} className="text-right cursor-pointer text-blue">
                View Route
              </Typography>
            }
          />
        )} */}
        </div>
        {/* <Typography variant="xs" className="mx-auto text-slate-300">
        Tines Optimized Route
      </Typography> */}
      </div>
    </AppearOnMount>
  )
}
