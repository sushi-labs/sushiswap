import { DotsHorizontalIcon } from '@heroicons/react/solid'
import { Amount, Token, Type } from '@sushiswap/currency'
import { STARGATE_TOKEN } from '@sushiswap/stargate'
import { Badge, Chip, NetworkIcon, Tooltip, Typography } from '@sushiswap/ui'
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
        <Tooltip
          placement="top"
          panel={
            <div className="relative flex items-center px-4 py-1">
              <div className="flex flex-grow items-center gap-3 z-[1]">
                <div className="flex items-center w-6 h-6">
                  <Badge
                    badgeContent={
                      <div className="rounded-full shadow-md ring-1 ring-black/20">
                        <NetworkIcon chainId={inputAmount.currency.chainId} width={16} height={16} />
                      </div>
                    }
                  >
                    <div className="w-5 h-5">
                      <Icon currency={inputAmount.currency} width={20} height={20} />
                    </div>
                  </Badge>
                </div>
                <div className="flex items-center rounded-full bg-slate-800 min-w-[50px]">
                  {srcTrade && (
                    <Tooltip
                      placement="top"
                      button={
                        <Chip
                          color="gray"
                          label={srcTrade.isV1() ? 'Legacy' : 'Trident'}
                          size="sm"
                          className="!px-2 h-full"
                        />
                      }
                      panel={
                        <div className="flex flex-col gap-1 p-2 bg-slate-700 !rounded-md">
                          {srcTrade.isSingle() ? <SingleRoute trade={srcTrade} /> : <ComplexRoute trade={srcTrade} />}
                        </div>
                      }
                    />
                  )}
                </div>
                <div className="bg-slate-800 p-1.5 w-full justify-center flex gap-1 rounded-full border-2 border-dashed border-slate-600 items-center">
                  <Badge
                    badgeContent={
                      <div className="rounded-full shadow-md ring-1 ring-black/20">
                        <NetworkIcon
                          chainId={srcBridgeToken.wrapped.chainId}
                          width={14}
                          height={14}
                          className="saturate-0"
                        />
                      </div>
                    }
                  >
                    <div className="w-[18px] h-[18px]">
                      <Icon currency={srcBridgeToken.wrapped} width={18} height={18} />
                    </div>
                  </Badge>

                  <DotsHorizontalIcon width={12} className="text-slate-600" />
                  <div className="flex items-center justify-center">
                    <Icon currency={STARGATE_TOKEN} width={18} height={18} />
                  </div>
                  <DotsHorizontalIcon width={12} className="text-slate-600" />
                  <Badge
                    badgeContent={
                      <div className="rounded-full shadow-md ring-1 ring-black/20">
                        <NetworkIcon
                          chainId={dstBridgeToken.wrapped.chainId}
                          width={14}
                          height={14}
                          className="saturate-0"
                        />
                      </div>
                    }
                  >
                    <div className="w-[18px] h-[18px]">
                      <Icon currency={dstBridgeToken.wrapped} width={18} height={18} />
                    </div>
                  </Badge>
                </div>
                <div className="flex items-center rounded-full bg-slate-800 min-w-[50px]">
                  {dstTrade && (
                    <Tooltip
                      button={
                        <Chip
                          color="gray"
                          label={dstTrade.isV1() ? 'Legacy' : 'Trident'}
                          size="sm"
                          className="!px-2 h-full"
                        />
                      }
                      panel={
                        <div className="flex flex-col gap-1 p-2 bg-slate-700 !rounded-md">
                          {dstTrade.isSingle() ? <SingleRoute trade={dstTrade} /> : <ComplexRoute trade={dstTrade} />}
                        </div>
                      }
                    />
                  )}
                </div>
                <div className="flex items-center w-6 h-6">
                  <Badge
                    badgeContent={
                      <div className="rounded-full shadow-md ring-1 ring-black/20">
                        <NetworkIcon chainId={dstBridgeToken.wrapped.chainId} width={16} height={16} />
                      </div>
                    }
                  >
                    <div className="w-5 h-5">
                      <Icon currency={outputAmount.currency} width={20} height={20} />
                    </div>
                  </Badge>
                </div>
              </div>
              <div className="absolute z-0 border border-dashed pointer-events-none left-4 right-4 border-slate-600" />
            </div>
          }
          button={
            <Typography variant="sm" weight={500} className="text-right cursor-pointer text-blue">
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

export const SameChainRoute: FC<SameChainRoute> = ({ trade }) => {
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
