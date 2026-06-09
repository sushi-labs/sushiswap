import { Button } from '@sushiswap/ui'
import { DownTriangleIcon } from '@sushiswap/ui/icons/DownTriangleIcon'
import { PerpsCard } from '../_common/perps-card'
import { UpdateLeverageDialog, UpdateMarginModeDialog } from '../exchange'
import { useAssetState } from './asset-state-provider'

export const Leverage = () => {
  const {
    state: {
      activeAsset,
      currentLeverageForAsset,
      currentLeverageTypeForAsset,
      asset,
      activeAssetDataQuery: { isLoading, isError },
    },
  } = useAssetState()

  if (asset?.marketType === 'spot') return null

  if (isLoading || isError) {
    return (
      <PerpsCard className="flex items-center w-full">
        <Button
          size="sm"
          variant="ghost"
          fullWidth
          disabled
          className="!cursor-not-allowed"
        >
          Cross
          <DownTriangleIcon width={6} height={6} />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          fullWidth
          disabled
          className="!cursor-not-allowed"
        >
          10x
          <DownTriangleIcon width={6} height={6} />
        </Button>
      </PerpsCard>
    )
  }

  return (
    <PerpsCard className="flex items-center w-full">
      <UpdateMarginModeDialog
        trigger={
          <Button size="sm" variant="ghost" fullWidth className="capitalize">
            {currentLeverageTypeForAsset}
            <DownTriangleIcon width={6} height={6} />
          </Button>
        }
        assetString={activeAsset}
        currentLeverage={currentLeverageForAsset}
        currentLeverageType={currentLeverageTypeForAsset}
      />
      <UpdateLeverageDialog
        trigger={
          <Button size="sm" variant="ghost" fullWidth>
            {currentLeverageForAsset}x
            <DownTriangleIcon width={6} height={6} />
          </Button>
        }
        assetString={activeAsset}
        currentLeverage={currentLeverageForAsset}
        isCross={currentLeverageTypeForAsset === 'cross'}
      />
    </PerpsCard>
  )
}
