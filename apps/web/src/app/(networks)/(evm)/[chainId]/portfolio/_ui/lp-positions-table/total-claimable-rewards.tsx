import { Currency, SkeletonBox, SkeletonCircle } from '@sushiswap/ui'
import { formatUSD } from 'sushi'
import { type EvmChainId, EvmToken } from 'sushi/evm'
import type { Address } from 'viem'
import { useLPPositionContext } from '~evm/[chainId]/portfolio/lp-position-provider'

export const TotalClaimableRewards = () => {
  const {
    state: { lpPositionQuery },
  } = useLPPositionContext()

  return (
    <div className="flex text-slate-450 dark:text-slate-500 items-center py-1 px-2 rounded-lg gap-2 text-xs whitespace-nowrap bg-[#4217FF14] dark:bg-[#FFFFFF14]">
      <p className="font-medium">Total Claimable Rewards: </p>
      <div className="flex items-center gap-1">
        {lpPositionQuery?.isLoading ? (
          <>
            <SkeletonBox className="w-[60px] h-4" />
            <div className="flex">
              <SkeletonCircle radius={16} />
              <SkeletonCircle radius={16} className="-ml-2" />
            </div>
          </>
        ) : (
          <>
            <p className="font-bold text-slate-900 dark:text-white">
              {formatUSD(lpPositionQuery?.data?.totalClaimableRewardsUSD || 0)}
            </p>
            {lpPositionQuery?.data?.totalClaimableRewards &&
            lpPositionQuery?.data?.totalClaimableRewards?.length > 0 ? (
              <Currency.IconList
                iconHeight={16}
                iconWidth={16}
                className="!border-0"
              >
                {lpPositionQuery?.data?.totalClaimableRewards?.map(
                  ({ token }) => (
                    <Currency.Icon
                      key={token.address}
                      currency={
                        new EvmToken({
                          chainId: token?.chainId as EvmChainId,
                          address: token?.address as Address,
                          decimals: token?.decimals,
                          symbol: token?.symbol,
                          name: token?.name,
                        })
                      }
                    />
                  ),
                )}
              </Currency.IconList>
            ) : null}
          </>
        )}
      </div>
    </div>
  )
}
