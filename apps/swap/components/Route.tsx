import { ExternalLinkIcon } from '@heroicons/react/solid'
import chains from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { RToken } from '@sushiswap/tines'
import { AppearOnMount, Chip, Currency, Link, Tooltip, Typography } from '@sushiswap/ui'
import { TradeOutput } from '@sushiswap/wagmi'
import { FC } from 'react'

import { useTrade } from './TradeProvider'

const tokenFromRToken = (token: RToken) => {
  return new Token({ address: token.address, symbol: token.symbol, chainId: Number(token.chainId), decimals: 18 })
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
              className="py-1 px-1.5 flex items-center gap-1.5 bg-white bg-slate-700 cursor-pointer hover:bg-slate-600 rounded-lg overflow-hidden"
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
    <Typography variant="xs" className="text-center text-slate-400 italic">
      Complex route view coming soon
    </Typography>
  )
  //
  // return (
  //   <>
  //     <div className="grid items-center grid-flow-col gap-4">
  //       <div className="space-y-2">
  //         <div className="z-10 flex items-center gap-4 p-2 text-xs font-medium leading-4 shadow shadow-slate-900 text-slate-300 bg-slate-800 rounded-2xl">
  //           <div className="w-6 h-6">
  //             <Currency.Icon currency={trade.inputAmount.currency} width={24} height={24} />
  //           </div>
  //         </div>
  //       </div>
  //       <div className="grid items-center grid-flow-row gap-4">
  //         <div>
  //           <div className="grid items-center grid-flow-col gap-4 grid-col-4">
  //             <div className="space-y-2">
  //               {initialPaths.map((initialPath, i) => (
  //                 <div
  //                   key={i}
  //                   className="z-10 flex items-center justify-between gap-4 p-2 text-xs font-medium leading-4 shadow shadow-slate-900 text-slate-300 bg-slate-800 rounded-2xl whitespace-nowrap"
  //                 >
  //                   {Number(initialPath.absolutePortion * 100).toFixed(2)}%
  //                   <DotsHorizontalIcon width={12} className="text-slate-600" />
  //                   <Typography variant="xs" weight={500}>
  //                     {initialPath.poolType} {initialPath.tokenFrom.symbol}/{initialPath.tokenTo.symbol}{' '}
  //                     {initialPath.poolFee * 100}%
  //                   </Typography>
  //                   <DotsHorizontalIcon width={12} className="text-slate-600" />
  //                   <Typography variant="xs" weight={500}>
  //                     {initialPath.tokenTo.symbol}
  //                   </Typography>
  //                 </div>
  //               ))}
  //             </div>
  //             <div className="space-y-2">
  //               {percentPaths.map((percentagePath, i) => (
  //                 <div
  //                   key={i}
  //                   className="z-10 grid items-center justify-between grid-flow-col gap-4 p-2 text-xs font-medium leading-4 shadow shadow-slate-900 text-slate-300 bg-slate-800 rounded-2xl whitespace-nowrap"
  //                 >
  //                   {Number(percentagePath.absolutePortion * 100).toFixed(2)}%
  //                   <DotsHorizontalIcon width={12} className="text-slate-600" />
  //                   <Typography variant="xs" weight={500}>
  //                     {percentagePath.poolType} {percentagePath.tokenFrom.symbol}/{percentagePath.tokenTo.symbol}{' '}
  //                     {percentagePath.poolFee * 100}%
  //                   </Typography>
  //                 </div>
  //               ))}
  //             </div>
  //             <div className="space-y-2">
  //               {finalPaths.map((finalPath, i) => (
  //                 <div
  //                   key={i}
  //                   className="z-10 grid items-center justify-between grid-flow-col gap-4 p-2 text-xs font-medium leading-4 shadow shadow-slate-900 text-slate-300 bg-slate-800 rounded-2xl whitespace-nowrap"
  //                 >
  //                   {Number(finalPath.absolutePortion * 100).toFixed(2)}%
  //                   <DotsHorizontalIcon width={12} className="text-slate-600" />
  //                   <Typography variant="xs" weight={500}>
  //                     {finalPath.poolType} {finalPath.tokenFrom.symbol}/{finalPath.tokenTo.symbol}{' '}
  //                     {finalPath.poolFee * 100}%
  //                   </Typography>
  //                   <DotsHorizontalIcon width={12} className="text-slate-600" />
  //                   <Typography variant="xs" weight={500}>
  //                     {finalPath.tokenTo.symbol}
  //                   </Typography>
  //                 </div>
  //               ))}
  //             </div>
  //           </div>
  //         </div>
  //         <div className="flex flex-col w-full gap-4">
  //           {directPaths.map((directPath, i) => (
  //             <div key={i} className="flex flex-grow gap-4">
  //               <div className="z-10 flex items-center justify-between flex-grow p-2 mx-auto text-xs font-medium leading-4 shadow shadow-slate-900 text-slate-300 bg-slate-800 rounded-2xl whitespace-nowrap">
  //                 {Number(directPath.absolutePortion * 100).toFixed(2)}%
  //                 <DotsHorizontalIcon width={12} className="text-slate-600" />
  //                 <Typography variant="xs" weight={500}>
  //                   {directPath.poolType} {directPath.tokenFrom.symbol}/{directPath.tokenTo.symbol}{' '}
  //                   {directPath.poolFee * 100}%
  //                 </Typography>
  //                 <DotsHorizontalIcon width={12} className="text-slate-600" />
  //                 <Typography variant="xs" weight={500}>
  //                   {directPath.tokenTo.symbol}
  //                 </Typography>
  //               </div>
  //             </div>
  //           ))}
  //         </div>
  //       </div>
  //       <div>
  //         <div className="z-10 flex items-center gap-4 p-2 text-xs font-medium leading-4 shadow shadow-slate-900 text-slate-300 bg-slate-800 rounded-2xl">
  //           <div className="w-6 h-6">
  //             <Currency.Icon currency={trade.outputAmount.currency} width={24} height={24} />
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </>
  // )
}

export const Route: FC = () => {
  const { trade } = useTrade()
  if (!trade) return <></>

  return (
    <AppearOnMount>
      <div className="pt-2">
        {trade.isSingle() && <SingleRoute trade={trade} />}
        {trade.isComplex() && <ComplexRoute trade={trade} />}
      </div>
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
