import { formatUSD } from '@sushiswap/format'
import { Button, Currency, Typography } from '@sushiswap/ui'
import { Checker } from '@sushiswap/wagmi'
import { FC } from 'react'

import { Pair } from '../../.graphclient'
import { usePoolPositionRewards } from '../PoolPositionRewardsProvider'

interface PoolMyRewardsProps {
  pair: Pair
}

export const PoolMyRewards: FC<PoolMyRewardsProps> = ({ pair }) => {
  const { pendingRewards, rewardTokens, harvest, isError, values, isLoading, error } = usePoolPositionRewards()

  return (
    <div className="flex flex-col gap-3">
      <div className="flex bg-slate-800 flex flex-col rounded-2xl shadow-md shadow-black/30">
        <div className="flex justify-between items-center px-5 py-4 border-b border-slate-200/5">
          <Typography weight={600} className="text-slate-50">
            My Rewards
          </Typography>
          <div className="flex flex-col">
            <Typography variant="sm" weight={600} className="text-slate-50 text-right">
              {isNaN(+formatUSD(Number(values.reduce((sum, value) => Number(sum) + Number(value), 0))))
                ? '$0.00'
                : formatUSD(Number(values.reduce((sum, value) => Number(sum) + Number(value), 0)))}
            </Typography>
          </div>
        </div>
        <div className="flex flex-col px-5 py-4 gap-3">
          {pendingRewards?.map((reward, index) => {
            if (!reward && isLoading && !isError)
              return (
                <div className="justify-between grid gap-2 grid-cols-10" key={index}>
                  <div className="h-[20px] bg-slate-700 animate-pulse col-span-8 rounded-full" />
                  <div className="h-[20px] bg-slate-700 animate-pulse col-span-2 rounded-full" />
                </div>
              )

            return (
              <div className="flex justify-between items-center" key={index}>
                <div className="flex gap-2 items-center">
                  <Currency.Icon currency={rewardTokens[index]} width={20} height={20} />
                  <Typography variant="sm" weight={600} className="text-slate-300">
                    {reward?.toSignificant(6)} {rewardTokens[index].symbol}
                  </Typography>
                </div>
                <Typography variant="xs" weight={500} className="text-slate-400">
                  {isNaN(+formatUSD(Number(values[index]))) ? '$0.00' : formatUSD(Number(values[index]))}
                </Typography>
              </div>
            )
          })}
        </div>
      </div>
      <Checker.Connected fullWidth size="md">
        <Checker.Network fullWidth size="md" chainId={pair.chainId}>
          <Button size="md" fullWidth onClick={harvest}>
            Claim
          </Button>
        </Checker.Network>
      </Checker.Connected>
      {error && (
        <Typography variant="xs" className="text-center text-red mt-2" weight={500}>
          {error}
        </Typography>
      )}
    </div>
  )
  //
  // return useMemo(() => {
  //   if (typeof farmId === 'undefined' || !incentives) return <></>
  //
  //   if (isLg) {
  //     return (
  //       <AppearOnMount>
  //         <div className="flex flex-col gap-3">
  //           <StakedRewardsFetcher
  //             account={address}
  //             chainId={pair.chainId}
  //             farmId={farmId}
  //             incentives={incentives}
  //             chefType={chefType}
  //             liquidityToken={liquidityToken}
  //           >
  //             {({ values, pendingRewards, isLoading, rewardTokens, harvest, error }) => (
  //
  //             )}
  //           </StakedRewardsFetcher>
  //         </div>
  //       </AppearOnMount>
  //     )
  //   }
  //
  //   console.log('hi')
  //
  //   return (
  //     <>
  //       <AppearOnMount>
  //         <div className="fixed bottom-6 right-0 flex justify-center">
  //           <button
  //             onClick={() => setOpen(true)}
  //             className="inline-flex bg-blue cursor-pointer rounded-full shadow-md shadow-black/50 px-6 py-3"
  //           >
  //             <Typography variant="sm" weight={600} className="text-slate-50">
  //               My Rewards
  //             </Typography>
  //           </button>
  //         </div>
  //         <div className="flex flex-col gap-3">
  //           <StakedRewardsFetcher
  //             account={address}
  //             chainId={pair.chainId}
  //             farmId={farmId}
  //             incentives={incentives}
  //             chefType={chefType}
  //             liquidityToken={liquidityToken}
  //           >
  //             {({ values, pendingRewards, isLoading, rewardTokens, harvest, error }) => (
  //               <>
  //                 <Dialog onClose={handleClose} open={open}>
  //                   <Dialog.Content className="!pb-6">
  //                     <Dialog.Header title="My Rewards" onClose={handleClose} />
  //                     <div className="flex justify-between items-center p-2 pb-3 pt-4">
  //                       <Typography weight={600} className="text-slate-50">
  //                         My Rewards
  //                       </Typography>
  //                       <div className="flex flex-col">
  //                         <Typography variant="sm" weight={600} className="text-slate-50 text-right">
  //                           {isNaN(+formatUSD(Number(values.reduce((sum, value) => Number(sum) + Number(value), 0))))
  //                             ? '$0.00'
  //                             : formatUSD(Number(values.reduce((sum, value) => Number(sum) + Number(value), 0)))}
  //                         </Typography>
  //                       </div>
  //                     </div>
  //                     <div className="flex flex-col px-5 py-4 gap-3">
  //                       {pendingRewards?.map((reward, index) => {
  //                         if (!reward && isLoading)
  //                           return (
  //                             <div className="justify-between grid gap-2 grid-cols-10" key={index}>
  //                               <div className="h-[20px] bg-slate-700 animate-pulse col-span-8 rounded-full" />
  //                               <div className="h-[20px] bg-slate-700 animate-pulse col-span-2 rounded-full" />
  //                             </div>
  //                           )
  //
  //                         return (
  //                           <div className="flex justify-between items-center" key={index}>
  //                             <div className="flex gap-2 items-center">
  //                               <Currency.Icon currency={rewardTokens[index]} width={20} height={20} />
  //                               <Typography variant="sm" weight={600} className="text-slate-300">
  //                                 {reward?.toSignificant(6)} {rewardTokens[index].symbol}
  //                               </Typography>
  //                             </div>
  //                             <Typography variant="xs" weight={500} className="text-slate-400">
  //                               {isNaN(+formatUSD(Number(values[index]))) ? '$0.00' : formatUSD(Number(values[index]))}
  //                             </Typography>
  //                           </div>
  //                         )
  //                       })}
  //                     </div>
  //                     <div className="px-2">
  //                       <hr className="border-t border-slate-200/10 my-3 px-2" />
  //                     </div>
  //                     <div className="px-2 -top-1">
  //                       <Checker.Connected fullWidth size="md">
  //                         <Checker.Network fullWidth size="md" chainId={pair.chainId}>
  //                           <Button size="md" fullWidth onClick={harvest}>
  //                             Claim
  //                           </Button>
  //                         </Checker.Network>
  //                       </Checker.Connected>
  //                       {error && (
  //                         <Typography variant="xs" className="text-center text-red mt-2" weight={500}>
  //                           {error}
  //                         </Typography>
  //                       )}
  //                     </div>
  //                   </Dialog.Content>
  //                 </Dialog>
  //               </>
  //             )}
  //           </StakedRewardsFetcher>
  //         </div>
  //       </AppearOnMount>
  //     </>
  //   )
  // }, [address, chefType, farmId, handleClose, incentives, isLg, liquidityToken, open, pair.chainId])
}
