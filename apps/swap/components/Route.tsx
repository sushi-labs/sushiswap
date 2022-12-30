import { ExternalLinkIcon } from '@heroicons/react/solid'
import chains from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { RToken } from '@sushiswap/tines'
import { AppearOnMount, Chip, Currency, Link, Tooltip, Typography } from '@sushiswap/ui'
import { TradeOutput } from '@sushiswap/wagmi'
import { FC, useEffect, useRef, useState } from 'react'

import { useTrade } from './TradeProvider'

const tokenFromRToken = (token: RToken) => {
  return new Token({
    address: token.address,
    symbol: token.symbol,
    chainId: Number(token.chainId),
    decimals: 18,
  })
}

// Can render an entire tines single route with dots between
export const SingleRoute: FC<{ trade: TradeOutput }> = ({ trade }) => {
  if (!trade) return <></>

  const legs = trade.route.legs.length

  return (
    <div className="flex justify-between items-center gap-1 relative">
      <div className="absolute inset-0 left-1 right-1 text-slate-600 pointer-events-none z-[-1]">
        <svg
          width="100%"
          height="35"
          viewBox="850 0 300 200"
          xmlns="http://www.w3.org/2000/svg"
          className="sc-o1ook0-5 iESzev"
        >
          <line
            x1="0"
            x2="3000"
            y1="100"
            y2="100"
            stroke="currentColor"
            strokeWidth="20"
            strokeLinecap="round"
            strokeDasharray="1, 45"
          />
        </svg>
      </div>
      <Typography
        weight={600}
        variant="sm"
        className="py-1 px-1.5 flex items-center gap-1 bg-slate-700 rounded-lg overflow-hidden"
      >
        100%
      </Typography>
      {trade.route.legs.map((leg, i) => (
        <Tooltip
          key={i}
          mouseEnterDelay={0.4}
          button={
            <div
              key={i}
              className="py-1 px-1.5 flex items-center gap-1.5 bg-slate-700 cursor-pointer hover:bg-slate-600 rounded-lg overflow-hidden"
            >
              <Currency.Icon currency={tokenFromRToken(leg.tokenFrom)} width={20} height={20} />
              {legs < 3 ? (
                <Typography variant="sm" weight={600} className="py-0.5">
                  {leg.poolFee * 100}%
                </Typography>
              ) : (
                <></>
              )}
            </div>
          }
          panel={
            <div className="flex flex-col gap-2">
              <div className="flex items-center">
                <Currency.IconList iconWidth={20} iconHeight={20}>
                  <Currency.Icon currency={tokenFromRToken(leg.tokenFrom)} />
                  <Currency.Icon currency={tokenFromRToken(leg.tokenTo)} />
                </Currency.IconList>
                <Typography variant="sm" weight={600} className="flex gap-1 text-slate-50">
                  {leg.tokenFrom.symbol} <span className="text-slate-500">/</span> {leg.tokenTo.symbol}
                </Typography>
                <Link.External href={chains[trade.inputAmount.currency.chainId].getTokenUrl(leg.poolAddress)}>
                  <div className="pl-1 -mt-0.5">
                    <ExternalLinkIcon className="text-blue hover:text-blue-400" width={18} height={18} />
                  </div>
                </Link.External>
              </div>
              <Typography variant="xs" weight={600} className="flex gap-1.5 items-end text-slate-400">
                <Chip color="gray" size="sm" label={leg.poolType} />
                <Chip color="gray" size="sm" label={`Fee ${leg.poolFee * 100}%`} />
              </Typography>
            </div>
          }
        />
      ))}
      <div className="w-6 h-6">
        <Currency.Icon currency={trade.outputAmount.currency} width={24} height={24} />
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

  // TODO: Seperate into groups of tokenFrom
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
    <div className="h-full">
      <div className="flex flex-col gap-4">
        {directPaths.map((directPath, i) => (
          <ComplexRoutePath
            key={i}
            fromToken={tokenFromRToken(directPath.tokenFrom)}
            toToken={tokenFromRToken(directPath.tokenTo)}
            poolType={directPath.poolType}
            poolFee={directPath.poolFee}
            portion={directPath.absolutePortion}
          />
        ))}
        {initialPaths.map((initialPath, i) => (
          <ComplexRoutePath
            key={i}
            fromToken={tokenFromRToken(initialPath.tokenFrom)}
            toToken={tokenFromRToken(initialPath.tokenTo)}
            poolType={initialPath.poolType}
            poolFee={initialPath.poolFee}
            portion={initialPath.absolutePortion}
          />
        ))}
        {percentPaths.map((percentagePath, i) => (
          <ComplexRoutePath
            key={i}
            fromToken={tokenFromRToken(percentagePath.tokenFrom)}
            toToken={tokenFromRToken(percentagePath.tokenTo)}
            poolType={percentagePath.poolType}
            poolFee={percentagePath.poolFee}
            portion={percentagePath.absolutePortion}
          />
        ))}
        {finalPaths.map((finalPath, i) => (
          <ComplexRoutePath
            key={i}
            fromToken={tokenFromRToken(finalPath.tokenFrom)}
            toToken={tokenFromRToken(finalPath.tokenTo)}
            poolType={finalPath.poolType}
            poolFee={finalPath.poolFee}
            portion={finalPath.absolutePortion}
          />
        ))}
      </div>
    </div>
  )
}

export const Route: FC = () => {
  const { trade } = useTrade()
  if (!trade) return <></>

  return (
    <AppearOnMount>
      {trade.isSingle() && <SingleRoute trade={trade} />}
      {trade.isComplex() && <ComplexRoute trade={trade} />}
      <div className="flex flex-col gap-4">
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
        {/* <Typography variant="xs" className="mx-auto text-slate-300">
        Tines Optimized Route
      </Typography> */}
      </div>
    </AppearOnMount>
  )
}

interface ComplexRoutePathProps {
  fromToken: Token
  toToken: Token
  poolType: 'Stable' | 'Classic' | 'Unknown'
  poolFee: number
  portion: number
}

const ComplexRoutePath: FC<ComplexRoutePathProps> = ({ fromToken, toToken, poolType, poolFee, portion }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (ref.current) {
      setWidth((ref.current.offsetWidth - 28) * Number(portion))
    }
  }, [portion])

  return (
    <div className="relative grid grid-cols-10">
      <div className="absolute inset-0 flex items-center pointer-events-none z-0">
        <svg viewBox="850 0 300 200" width="100%" height="35" className="text-slate-700">
          <line
            x1="0"
            x2="3000"
            y1="100"
            y2="100"
            stroke="currentColor"
            strokeWidth="20"
            strokeLinecap="round"
            strokeDasharray="1, 45"
          />
        </svg>
      </div>
      <div className="z-[10] col-span-4 flex justify-start items-center">
        <div
          ref={ref}
          className="flex relative justify-between gap-2 items-center overflow-hidden rounded-full p-2 border-2 border-slate-900 bg-slate-900"
        >
          <div
            className="absolute bg-slate-800 pointer-events-none inset-0 rounded-full"
            style={{ width: `calc(28px + ${width}px)` }}
          />
          <div className="z-[10] flex items-center gap-1">
            <Currency.Icon disableLink currency={fromToken} width={16} height={16} />
            <Typography variant="xs" weight={600} className="text-slate-200">
              {fromToken.symbol}
            </Typography>
          </div>
          <Typography variant="xs" weight={600} className="z-[10] text-slate-400">
            {Number(portion * 100).toFixed(2)}%
          </Typography>
        </div>
      </div>
      <div className="z-[10] col-span-3 flex justify-center items-center">
        <Typography
          variant="xs"
          weight={500}
          className="bg-slate-800 text-slate-200 flex items-center border border-slate-200/10 rounded-lg h-[36px] px-2"
        >
          {poolType} {Number(poolFee * 100).toFixed(2)}%
        </Typography>
      </div>
      <div className="z-[10] col-span-3 flex justify-end items-center">
        <div className="p-0.5 rounded-full bg-slate-900">
          <div className="px-2 bg-slate-700 h-[36px] rounded-full flex items-center gap-1">
            <Currency.Icon disableLink currency={toToken} width={16} height={16} />
            <Typography variant="xs" weight={600} className="text-slate-200">
              {toToken.symbol}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  )
}
