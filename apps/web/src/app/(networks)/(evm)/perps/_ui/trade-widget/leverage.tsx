import { Button } from '@sushiswap/ui'
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
      <div className="flex items-center gap-2 w-full">
        <Button size="sm" variant="perps-default" fullWidth disabled>
          Cross
        </Button>
        <Button size="sm" variant="perps-secondary" fullWidth disabled>
          10x
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 w-full">
      <UpdateMarginModeDialog
        trigger={
          <Button
            size="sm"
            variant="perps-default"
            fullWidth
            className="capitalize"
          >
            {currentLeverageTypeForAsset}
          </Button>
        }
        assetString={activeAsset}
        currentLeverage={currentLeverageForAsset}
        currentLeverageType={currentLeverageTypeForAsset}
      />
      <UpdateLeverageDialog
        trigger={
          <Button size="sm" variant="perps-secondary" fullWidth>
            {currentLeverageForAsset}x
          </Button>
        }
        assetString={activeAsset}
        currentLeverage={currentLeverageForAsset}
        isCross={currentLeverageTypeForAsset === 'cross'}
      />
    </div>
  )
}
