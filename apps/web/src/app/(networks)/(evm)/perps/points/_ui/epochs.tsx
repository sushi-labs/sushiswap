import { SkeletonBox, SkeletonText } from '@sushiswap/ui'
import { useMemo } from 'react'
import { perpsNumberFormatter, useSushiPointsOverview } from 'src/lib/perps'
import { useAccount } from 'src/lib/wallet'
import { PerpsCard } from '~evm/perps/_ui/_common'

export const Epochs = () => {
  const address = useAccount('evm')
  const { data, isLoading } = useSushiPointsOverview({ address })
  const currentPoints = useMemo(
    () =>
      data?.totalPoints
        ? perpsNumberFormatter({
            value: data?.totalPoints,
            minFraxDigits: 0,
            maxFraxDigits: 0,
          })
        : '0',
    [data?.totalPoints],
  )
  return (
    <PerpsCard className="p-3 gap-2 flex flex-col justify-between w-full h-full">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <PerpsCard className="p-1" rounded="full">
            <div className="bg-perps-muted/10 rounded-full px-2 py-0.5 text-xs">
              Epoch 1
            </div>
          </PerpsCard>
          <div className="text-perps-muted-50 text-sm">Season One</div>
        </div>
        <div className="text-perps-muted-50 text-xs lg:text-sm">
          Total Epoch Points
        </div>
        {isLoading ? (
          <div className="w-24 h-8">
            <SkeletonText fontSize="xl" />
          </div>
        ) : (
          <div className="font-medium text-lg md:text-2xl text-perps-muted">
            {currentPoints}
          </div>
        )}
      </div>
      <div className="flex items-center justify-between text-xs">
        {isLoading ? (
          <div className="w-full h-[20px]">
            <SkeletonBox className="w-full h-full" />
          </div>
        ) : (
          <>
            <div className="text-perps-muted-50">Cycle</div>
            <div className="text-perps-muted-70">
              {currentPoints} Points Earned
            </div>
          </>
        )}
      </div>
    </PerpsCard>
  )
}
