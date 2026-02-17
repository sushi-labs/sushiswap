import { Button } from '@sushiswap/ui'
import { useMemo } from 'react'
import { UpdateLeverageDialog } from '../exchange/update-leverage-dialog'
import { UpdateMarginModeDialog } from '../exchange/update-margin-mode-dialog'
import { useAssetState } from './asset-state-provider'

export const Leverage = () => {
  const {
    state: {
      activeAsset,
      activeAssetDataQuery: { data: activeAssetData, isLoading, isError },
    },
  } = useAssetState()

  const currentLeverage = useMemo(
    () => activeAssetData?.leverage?.value ?? 1,
    [activeAssetData?.leverage?.value],
  )
  const currentLeverageIsCross = useMemo(
    () => activeAssetData?.leverage?.type === 'cross',
    [activeAssetData?.leverage?.type],
  )

  if (isLoading || isError) {
    return (
      <div className="flex items-center gap-2 w-full">
        <Button size="sm" variant="secondary" fullWidth disabled>
          Cross
        </Button>
        <Button size="sm" variant="secondary" fullWidth disabled>
          10x
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 w-full">
      <UpdateMarginModeDialog
        trigger={
          <Button size="sm" variant="secondary" fullWidth>
            {currentLeverageIsCross ? 'Cross' : 'Isolated'}
          </Button>
        }
        assetString={activeAsset}
        currentLeverage={currentLeverage}
        currentLeverageType={currentLeverageIsCross ? 'cross' : 'isolated'}
      />
      <UpdateLeverageDialog
        trigger={
          <Button size="sm" variant="secondary" fullWidth>
            {currentLeverage}x
          </Button>
        }
        assetString={activeAsset}
        currentLeverage={currentLeverage}
        isCross={currentLeverageIsCross}
      />
    </div>
  )
}
