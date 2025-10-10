import { SkeletonBox } from '@sushiswap/ui'
import { useLPPositionContext } from '~evm/[chainId]/portfolio/lp-position-provider'

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export const TotalLPPositions = () => {
  const {
    state: { lpPositionQuery },
  } = useLPPositionContext()

  return (
    <div className="font-semibold whitespace-nowrap flex items-center gap-1">
      LP Positions:{' '}
      {lpPositionQuery?.isLoading ? (
        <SkeletonBox className="w-[70px] h-6" />
      ) : (
        //@dev the figma design shows usd value using this type of formatting
        formatter.format(lpPositionQuery?.data?.totalLPPositionsUSD || 0)
      )}
    </div>
  )
}
