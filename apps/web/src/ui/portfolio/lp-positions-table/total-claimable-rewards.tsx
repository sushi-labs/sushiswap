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
    <div className="flex text-[#0C0C23] dark:text-white items-center py-1 px-2 rounded-lg gap-2 text-xs bg-gradient-to-r whitespace-nowrap from-blue/[0.08] to-skyblue/[0.08]">
      <p className="font-medium  ">Total Claimable Rewards: </p>
      <div className="flex items-center gap-1">
        {lpPositionQuery?.isLoading ? (
          <>
            <SkeletonBox className="w-[60px] h-4" />
            <div className="flex">
              <SkeletonCircle radius={16} />
              <SkeletonCircle radius={16} className="-ml-2" />
              <SkeletonCircle radius={16} className="-ml-2" />
            </div>
          </>
        ) : (
          <>
            <p className="font-bold">
              {formatUSD(lpPositionQuery?.data?.totalClaimableRewardsUSD || 0)}
            </p>
            {lpPositionQuery?.data?.totalClaimableRewards &&
            lpPositionQuery?.data?.totalClaimableRewards?.length > 0 ? (
              <Currency.IconList iconHeight={16} iconWidth={16}>
                {lpPositionQuery?.data?.totalClaimableRewards?.map(
                  ({ token }) => (
                    <Currency.Icon
                      key={token.address}
                      className="!border-0"
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
