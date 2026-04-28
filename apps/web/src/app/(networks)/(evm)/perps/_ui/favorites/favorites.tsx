import { useLocalStorage } from '@sushiswap/hooks'
import { Button, Card, SkeletonBox, classNames } from '@sushiswap/ui'
import { SushiSubIcon } from '@sushiswap/ui/icons/SushiSubIcon'
import { useMemo } from 'react'
import {
  getSignForValue,
  getTextColorClass,
  perpsNumberFormatter,
  useFavoriteAssets,
} from 'src/lib/perps'
import { formatPercent } from 'sushi'
import { AssetIcon, FavoriteIcon, OverflowX } from '../_common'
import { PerpsCard } from '../_common/perps-card'
import { useAssetListState } from '../asset-selector'
import { useAssetState } from '../trade-widget'

export const Favorites = () => {
  const { favorites } = useFavoriteAssets()
  const [displayType, setDisplayType] = useLocalStorage<'usd' | 'percentage'>(
    'sushi.perps.favorite-display-type',
    'usd',
  )
  const {
    state: {
      assetListQuery: { data, isLoading },
    },
  } = useAssetListState()
  const {
    mutate: { setActiveAsset },
  } = useAssetState()

  const enrichedFavorites = useMemo(() => {
    if (isLoading || !data) return []
    return favorites
      ?.map((assetString) => data?.get?.(assetString))
      .filter(Boolean)
  }, [favorites, data, isLoading])

  return (
    <PerpsCard className="px-4 py-1 gap-4 flex items-center !max-h-fit">
      <div className="flex items-center gap-1">
        <FavoriteIcon className="h-5 w-5" isSelected />
        <span className="text-xs font-medium">Favorites</span>
      </div>
      {favorites?.length ? (
        <PerpsCard className="flex items-center bg-secondary rounded-lg p-0.5">
          <Button
            size="xs"
            variant={displayType === 'usd' ? 'perps-default' : 'ghost'}
            onClick={() => setDisplayType('usd')}
            className="!min-w-6 !w-6 font-semibold"
          >
            $
          </Button>
          <Button
            size="xs"
            variant={displayType === 'percentage' ? 'perps-default' : 'ghost'}
            onClick={() => setDisplayType('percentage')}
            className="!min-w-6 !w-6 font-semibold"
          >
            %
          </Button>
        </PerpsCard>
      ) : null}
      <OverflowX
        hideScrollBtns={
          (favorites.length && favorites.length !== enrichedFavorites.length) ||
          !enrichedFavorites.length
        }
        className="flex items-center gap-4"
      >
        {favorites.length && favorites.length !== enrichedFavorites.length ? (
          <FavoriteSkeletonRow />
        ) : favorites.length === enrichedFavorites.length &&
          enrichedFavorites?.length > 0 ? (
          <div className="flex items-center gap-2 snap-start">
            {enrichedFavorites?.map((asset, idx) => {
              if (!asset) return null
              const price = asset?.lastPrice
              const changeValue =
                displayType === 'usd'
                  ? asset?.change24hAbs
                  : asset?.change24hPct
              const formattedValue =
                displayType === 'usd'
                  ? perpsNumberFormatter({
                      value: price ?? '0',
                      maxFraxDigits: asset?.formatParseDecimals,
                    })
                  : formatPercent(Number(changeValue ?? 0))
              return (
                <div key={idx} className="flex items-center gap-2">
                  <Button
                    size="xs"
                    variant="ghost"
                    className="text-sm font-medium whitespace-nowrap !gap-1 tabular-nums focus:bg-transparent hover:!bg-secondary"
                    onClick={() => setActiveAsset(asset.name)}
                  >
                    <AssetIcon asset={asset} size="sm" />
                    {asset?.symbol}
                    <div
                      className={classNames(
                        getTextColorClass(
                          changeValue ? Number(changeValue) : 0,
                        ),
                      )}
                    >
                      {displayType === 'percentage'
                        ? getSignForValue(Number(changeValue ?? 0))
                        : null}
                      {formattedValue}
                    </div>
                  </Button>

                  {idx !== enrichedFavorites.length - 1 ? (
                    <SushiSubIcon className="!min-w-[12px] !min-h-[12px] !w-[12px] !h-[12px] mx-2 text-perps-muted/20" />
                  ) : null}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex text-xs gap-1 text-muted-foreground whitespace-nowrap py-[8px]">
            Click the <FavoriteIcon className="h-4 w-4" /> icon in the selector
            to add assets here for quick access.
          </div>
        )}
      </OverflowX>
    </PerpsCard>
  )
}

const FavoriteSkeleton = () => {
  return (
    <div className="flex items-center gap-1">
      <SkeletonBox className="w-14 h-5" />
      <SkeletonBox className="w-8 h-5 " />
    </div>
  )
}

const FavoriteSkeletonRow = () => {
  return Array(8)
    .fill(null)
    .map((_, idx) => <FavoriteSkeleton key={idx} />)
}
