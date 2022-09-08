import { DotsHorizontalIcon } from '@heroicons/react/solid'
import { Tooltip, Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { TradeOutput } from '../lib/hooks/useTrade'
import { useTrade } from './TradeProvider'

// Can render an entire tines single route with dots between
export const SingleRoute: FC<{ trade: TradeOutput }> = ({ trade }) => {
  if (!trade) return <></>
  return (
    <div className="relative flex">
      {trade.route.legs.map((leg, i) => (
        <div key={i} className="z-10 flex items-center gap-1 text-sm font-medium leading-4 text-slate-400">
          {i === 0 ? (
            <Typography variant="xs" weight={500}>
              {leg.tokenFrom.symbol}
            </Typography>
          ) : null}

          <DotsHorizontalIcon width={12} className="text-slate-600" />

          <Typography variant="xs" weight={500}>
            {leg.tokenTo.symbol}
          </Typography>
        </div>
      ))}
    </div>
  )
}

// Can render a tines multi route
export const ComplexRoute: FC<{ trade: TradeOutput }> = ({ trade }) => {
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
        <div key={i} className="z-10 flex items-center gap-1 text-xs font-medium leading-4 text-slate-300">
          {Number(initialPath.absolutePortion * 100).toFixed(2)}%
          <DotsHorizontalIcon width={12} className="text-slate-600" />
          <Typography variant="xs" weight={500}>
            {initialPath.tokenFrom.symbol}
          </Typography>
          <DotsHorizontalIcon width={12} className="text-slate-600" />
          {initialPath.poolFee * 100}%
          <DotsHorizontalIcon width={12} className="text-slate-600" />
          <Typography variant="xs" weight={500}>
            {initialPath.tokenTo.symbol}
          </Typography>
        </div>
      ))}
      {percentPaths.map((percentPath, i) => (
        <div key={i} className="z-10 flex items-center gap-1 text-xs font-medium leading-4 text-slate-300">
          {Number(percentPath.absolutePortion * 100).toFixed(2)}%
          <DotsHorizontalIcon width={12} className="text-slate-600" />
          <Typography variant="xs" weight={500}>
            {percentPath.tokenFrom.symbol}
          </Typography>
          <DotsHorizontalIcon width={12} className="text-slate-600" />
          {percentPath.poolFee * 100}%
          <DotsHorizontalIcon width={12} className="text-slate-600" />
          <Typography variant="xs" weight={500}>
            {percentPath.tokenTo.symbol}
          </Typography>
        </div>
      ))}
    </>
  )
}

export const Route: FC = () => {
  const { trade } = useTrade()
  if (!trade) return <></>

  return (
    <>
      <Typography variant="sm" className="text-slate-400">
        Optimized Route
      </Typography>
      <div className="flex justify-end">
        {trade.isSingle() && <SingleRoute trade={trade} />}
        {trade.isComplex() && (
          <Tooltip
            panel={<div className="flex flex-col gap-1">{<ComplexRoute trade={trade} />}</div>}
            button={
              <Typography variant="sm" weight={500} className="text-right cursor-pointer text-blue">
                View Route
              </Typography>
            }
          />
        )}
      </div>
    </>
  )
}
