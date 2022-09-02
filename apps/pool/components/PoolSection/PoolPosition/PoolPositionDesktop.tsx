import { formatUSD } from '@sushiswap/format'
import { Currency, Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { useTokensFromPair } from '../../../lib/hooks'
import { PairWithAlias } from '../../../types'
import { usePoolFarmRewards } from '../../PoolFarmRewardsProvider'
import { usePoolPosition } from '../../PoolPositionProvider'

interface PoolPositionProps {
  pair: PairWithAlias
}

export const PoolPositionDesktop: FC<PoolPositionProps> = ({ pair }) => {
  const { isFarm } = usePoolFarmRewards()
  const { token1, token0 } = useTokensFromPair(pair)
  const { underlying1, underlying0, value1, value0, isError, isLoading } = usePoolPosition()

  if (isLoading && !isError) {
    return (
      <div className="flex flex-col py-4 gap-2 mt-2 px-5">
        <div className="flex justify-between mb-2">
          <div className="h-[20px] bg-slate-600 animate-pulse w-[100px] rounded-full" />
          <div className="h-[20px] bg-slate-600 animate-pulse w-[60px] rounded-full" />
        </div>
        <div className="flex justify-between">
          <div className="h-[20px] bg-slate-700 animate-pulse w-[160px] rounded-full" />
          <div className="h-[20px] bg-slate-700 animate-pulse w-[60px] rounded-full" />
        </div>
        <div className="flex justify-between">
          <div className="h-[20px] bg-slate-700 animate-pulse w-[160px] rounded-full" />
          <div className="h-[20px] bg-slate-700 animate-pulse w-[60px] rounded-full" />
        </div>
      </div>
    )
  }

  if (!isLoading && !isError) {
    return (
      <div className="flex flex-col px-5 py-4 gap-3">
        {isFarm && (
          <div className="flex justify-between items-center mb-1">
            <Typography variant="sm" weight={600} className="text-slate-100">
              Unstaked Position
            </Typography>
            <Typography variant="xs" weight={500} className="text-slate-100">
              {formatUSD(Number(value0) + Number(value1))}
            </Typography>
          </div>
        )}
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <Currency.Icon currency={token0} width={20} height={20} />
            <Typography variant="sm" weight={600} className="text-slate-300">
              {underlying0?.toSignificant(6)} {token0.symbol}
            </Typography>
          </div>
          <Typography variant="xs" weight={500} className="text-slate-400">
            {formatUSD(Number(value0))}
          </Typography>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <Currency.Icon currency={token1} width={20} height={20} />
            <Typography variant="sm" weight={600} className="text-slate-300">
              {underlying1?.toSignificant(6)} {token1.symbol}
            </Typography>
          </div>
          <Typography variant="xs" weight={500} className="text-slate-400">
            {formatUSD(Number(value1))}
          </Typography>
        </div>
      </div>
    )
  }

  return <></>
  //
  // return useMemo(() => {
  //
  //
  //   return (
  //     <>
  //       <div className="fixed bottom-6 left-0 right-0 flex justify-center">
  //         <button
  //           onClick={() => setOpen(true)}
  //           className="inline-flex bg-blue cursor-pointer rounded-full shadow-md shadow-black/50 px-6 py-3"
  //         >
  //           <Typography variant="sm" weight={600} className="text-slate-50">
  //             My Position
  //           </Typography>
  //         </button>
  //       </div>
  //       <Dialog onClose={handleClose} open={open}>
  //         <Dialog.Content className="!pb-6">
  //           <Dialog.Header title="My Position" onClose={handleClose} />
  //           <div className="flex justify-between items-center p-2 pt-4">
  //             <Typography variant="sm" weight={600} className="text-slate-100">
  //               My Position
  //             </Typography>
  //             <div className="flex flex-col">
  //               <Typography variant="xs" weight={500} className="text-slate-100 text-right">
  //                 {formatUSD(Number(value0) + Number(value1))}
  //               </Typography>
  //             </div>
  //           </div>
  //           <div className="flex justify-between px-2 py-1">
  //             <div className="flex gap-2 items-center">
  //               <Currency.Icon currency={token0} width={20} height={20} />
  //               <Typography variant="sm" weight={500} className="text-slate-300">
  //                 {underlying0?.toSignificant(6)} {token0.symbol}
  //               </Typography>
  //             </div>
  //             <Typography variant="xs" weight={500} className="text-slate-400">
  //               {formatUSD(Number(value0))}
  //             </Typography>
  //           </div>
  //           <div className="flex justify-between px-2 py-1">
  //             <div className="flex gap-2 items-center">
  //               <Currency.Icon currency={token1} width={20} height={20} />
  //               <Typography variant="sm" weight={500} className="text-slate-300">
  //                 {underlying1?.toSignificant(6)} {token1.symbol}
  //               </Typography>
  //             </div>
  //             <Typography variant="xs" weight={500} className="text-slate-400">
  //               {formatUSD(Number(value1))}
  //             </Typography>
  //           </div>
  //           {farmId !== undefined && (
  //             <StakedPositionFetcher
  //               chainId={pair.chainId}
  //               liquidityToken={liquidityToken}
  //               totalSupply={totalSupply}
  //               reserve0={reserve0}
  //               reserve1={reserve1}
  //               chefType={chefType}
  //               farmId={farmId}
  //             >
  //               {({ value0, value1, underlying1, underlying0, isLoading, isError }) => {
  //                 if (isLoading) {
  //                   return (
  //                     <div className="flex flex-col px-2 py-4 gap-2 mt-2">
  //                       <div className="justify-between grid gap-10 grid-cols-10 mb-2">
  //                         <div className="h-[20px] bg-slate-600 animate-pulse col-span-8 rounded-full" />
  //                         <div className="h-[20px] bg-slate-600 animate-pulse col-span-2 rounded-full" />
  //                       </div>
  //                       <div className="justify-between grid gap-10 grid-cols-10">
  //                         <div className="h-[20px] bg-slate-700 animate-pulse col-span-8 rounded-full" />
  //                         <div className="h-[20px] bg-slate-700 animate-pulse col-span-2 rounded-full" />
  //                       </div>
  //                       <div className="justify-between grid gap-10 grid-cols-10">
  //                         <div className="h-[20px] bg-slate-700 animate-pulse col-span-8 rounded-full" />
  //                         <div className="h-[20px] bg-slate-700 animate-pulse col-span-2 rounded-full" />
  //                       </div>
  //                     </div>
  //                   )
  //                 }
  //
  //                 return (
  //                   <div className="flex flex-col px-2 py-4 gap-2 mt-2">
  //                     <div className="flex justify-between items-center mb-1">
  //                       <Typography variant="sm" weight={600} className="text-slate-100">
  //                         Staked Position
  //                       </Typography>
  //                       <Typography variant="xs" weight={500} className="text-slate-100">
  //                         {formatUSD(Number(value0) + Number(value1))}
  //                       </Typography>
  //                     </div>
  //                     <div className="flex justify-between items-center">
  //                       <div className="flex gap-2 items-center">
  //                         <Currency.Icon currency={token0} width={20} height={20} />
  //                         <Typography variant="sm" weight={500} className="text-slate-300">
  //                           {underlying0?.toSignificant(6)} {token0.symbol}
  //                         </Typography>
  //                       </div>
  //                       <Typography variant="xs" weight={500} className="text-slate-400">
  //                         {formatUSD(Number(value0))}
  //                       </Typography>
  //                     </div>
  //                     <div className="flex justify-between items-center">
  //                       <div className="flex gap-2 items-center">
  //                         <Currency.Icon currency={token1} width={20} height={20} />
  //                         <Typography variant="sm" weight={500} className="text-slate-300">
  //                           {underlying1?.toSignificant(6)} {token1.symbol}
  //                         </Typography>
  //                       </div>
  //                       <Typography variant="xs" weight={500} className="text-slate-400">
  //                         {formatUSD(Number(value1))}
  //                       </Typography>
  //                     </div>
  //                   </div>
  //                 )
  //               }}
  //             </StakedPositionFetcher>
  //           )}
  //           {/*<div className="px-2">*/}
  //           {/*  <hr className="border-t border-slate-200/10 my-2 px-2" />*/}
  //           {/*</div>*/}
  //           {/*<div className="flex justify-between items-center px-2 pt-3 pb-6">*/}
  //           {/*  <Typography variant="xs" className="text-slate-200">*/}
  //           {/*    LP Fees Earned*/}
  //           {/*  </Typography>*/}
  //           {/*  <div className="flex flex-col">*/}
  //           {/*    <Typography variant="xs" weight={600} className="text-slate-400">*/}
  //           {/*      /!*TODO*!/*/}
  //           {/*      $0.00*/}
  //           {/*    </Typography>*/}
  //           {/*  </div>*/}
  //           {/*</div>*/}
  //           <div className="px-2 mt-3">
  //             <PoolButtons pair={pair} />
  //           </div>
  //         </Dialog.Content>
  //       </Dialog>
  //     </>
  //   )
  // }, [
  //   balance,
  //   chefType,
  //   farmId,
  //   handleClose,
  //   incentives,
  //   isLg,
  //   liquidityToken,
  //   open,
  //   pair,
  //   reserve0,
  //   reserve1,
  //   token0,
  //   token1,
  //   totalSupply,
  //   underlying0,
  //   underlying1,
  //   value0,
  //   value1,
  // ])
}
