import { DotsHorizontalIcon } from '@heroicons/react/solid'
import { ChainId } from '@sushiswap/chain'
import { Badge, Chip, NetworkIcon, Popover, Typography } from '@sushiswap/ui'
import { Icon } from '@sushiswap/ui/currency/Icon'
import { FC } from 'react'

import { UseTradeOutput } from '../lib/hooks'

interface CrossChainRoute {
  srcTrade: UseTradeOutput
  dstTrade: UseTradeOutput
}

export const CrossChainRoute: FC<CrossChainRoute> = ({ srcTrade, dstTrade }) => {
  if (!srcTrade || !dstTrade) return <></>
  return (
    <>
      <Typography variant="xs" className="text-slate-400">
        Optimized Route
      </Typography>
      <div className="relative flex items-center">
        <div className="flex flex-grow items-center gap-3 z-[1]">
          <div className="flex items-center w-6 h-6">
            <Popover
              hover
              button={
                <Badge
                  badgeContent={
                    <div className="rounded-full shadow-md ring-1 ring-black/20">
                      <NetworkIcon chainId={srcTrade.inputAmount.currency.chainId} width={16} height={16} />
                    </div>
                  }
                >
                  <div className="w-5 h-5">
                    <Icon currency={srcTrade.inputAmount.currency} width={20} height={20} />
                  </div>
                </Badge>
              }
              panel={
                <div className="flex flex-col gap-1 p-2 bg-slate-700 !rounded-xl">
                  <Typography weight={700} variant="xxs" className="text-slate-400">
                    You pay
                  </Typography>
                  <Typography variant="xs" weight={700}>
                    {srcTrade.inputAmount.toSignificant(6)} {srcTrade.inputAmount.currency.symbol}
                  </Typography>
                </div>
              }
            />
          </div>
          <div className="flex items-center rounded-full bg-slate-700">
            <Popover
              hover
              button={
                <Chip
                  color={srcTrade.isV1() ? 'blue' : 'green'}
                  label={srcTrade.isV1() ? 'Legacy' : 'Trident'}
                  size="sm"
                  className="!px-2"
                />
              }
              panel={
                <div className="flex flex-col gap-1 p-2 bg-slate-700 !rounded-xl">
                  {srcTrade.isSingle() ? <SingleRoute trade={srcTrade} /> : <>Complex</>}
                </div>
              }
            />
          </div>
          <div className="bg-slate-700 px-2 py-2.5 w-full justify-center flex gap-1 rounded-full border-2 border-dashed border-slate-600">
            <Badge
              badgeContent={
                <div className="rounded-full shadow-md ring-1 ring-black/20">
                  <NetworkIcon chainId={srcTrade.inputAmount.currency.chainId} width={14} height={14} />
                </div>
              }
            >
              <div className="w-[18px] h-[18px]">
                <Icon currency={srcTrade.outputAmount.currency} width={18} height={18} />
              </div>
            </Badge>
            <DotsHorizontalIcon width={12} className="text-slate-600" />
            <NetworkIcon chainId={ChainId.ETHEREUM} width={18} height={18} />
            <DotsHorizontalIcon width={12} className="text-slate-600" />
            <Badge
              badgeContent={
                <div className="rounded-full shadow-md ring-1 ring-black/20">
                  <NetworkIcon chainId={dstTrade.outputAmount.currency.chainId} width={14} height={14} />
                </div>
              }
            >
              <div className="w-[18px] h-[18px]">
                <Icon currency={dstTrade.inputAmount.currency} width={18} height={18} />
              </div>
            </Badge>
          </div>
          <div className="flex items-center rounded-full bg-slate-700">
            <Popover
              hover
              button={
                <Chip
                  color={dstTrade.isV1() ? 'blue' : 'green'}
                  label={dstTrade.isV1() ? 'Legacy' : 'Trident'}
                  size="sm"
                  className="!px-2"
                />
              }
              panel={
                <div className="flex flex-col gap-1 p-2 bg-slate-700 !rounded-xl">
                  {dstTrade.isSingle() ? <SingleRoute trade={dstTrade} /> : <>Complex</>}
                </div>
              }
            />
          </div>
          <div className="flex items-center w-6 h-6">
            <Popover
              hover
              button={
                <Badge
                  badgeContent={
                    <div className="rounded-full shadow-md ring-1 ring-black/20">
                      <NetworkIcon chainId={dstTrade.inputAmount.currency.chainId} width={16} height={16} />
                    </div>
                  }
                >
                  <div className="w-5 h-5">
                    <Icon currency={dstTrade.outputAmount.currency} width={20} height={20} />
                  </div>
                </Badge>
              }
              panel={
                <div className="flex flex-col gap-1 p-2 bg-slate-700 !rounded-xl">
                  <Typography weight={700} variant="xxs" className="text-slate-400">
                    You receive
                  </Typography>
                  <Typography variant="xs" weight={700}>
                    {dstTrade.outputAmount.toSignificant(6)} {dstTrade.outputAmount.currency.symbol}
                  </Typography>
                </div>
              }
            />
          </div>
        </div>
        <div className="absolute z-0 w-full border border-dashed pointer-events-none border-slate-600" />
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
        <div key={i} className="z-10 flex items-center text-xs font-bold leading-4 text-slate-300">
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
  // TODO: Figure out what would make sense here...
  return <></>
}

export const SameChainRoute: FC<SameChainRoute> = ({ trade }) => {
  if (!trade) return <></>

  return (
    <>
      <div className="w-full h-px my-1 bg-slate-200/5" />
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
