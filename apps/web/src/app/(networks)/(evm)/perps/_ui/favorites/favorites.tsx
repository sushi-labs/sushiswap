import { StarIcon } from '@heroicons/react-v1/solid'
import { useLocalStorage } from '@sushiswap/hooks'
import { Button, Card, SkeletonBox, classNames } from '@sushiswap/ui'
import { useMemo } from 'react'
import {
  getSignForValue,
  getTextColorClass,
  perpsNumberFormatter,
  useFavoriteAssets,
} from 'src/lib/perps'
import { formatPercent } from 'sushi'
import { OverflowX } from '../_common'
import { useAssetListState } from '../asset-selector/asset-list-provider'
import { useAssetState } from '../trade-widget/asset-state-provider'

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
    <Card className="px-4 py-2 gap-4 flex items-center">
      <div className="flex items-center gap-1">
        <StarIcon className="h-5 w-5 text-yellow-400" />
        <span className="text-xs font-medium">Favorites</span>
      </div>
      {favorites?.length ? (
        <div className="flex items-center bg-secondary rounded-lg p-0.5">
          <Button
            size="xs"
            variant={displayType === 'usd' ? 'default' : 'ghost'}
            onClick={() => setDisplayType('usd')}
            className="!min-w-6 !w-6 font-semibold"
          >
            $
          </Button>
          <Button
            size="xs"
            variant={displayType === 'percentage' ? 'default' : 'ghost'}
            onClick={() => setDisplayType('percentage')}
            className="!min-w-6 !w-6 font-semibold"
          >
            %
          </Button>
        </div>
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
        ) : favorites.length === enrichedFavorites.length ? (
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
                      maxFraxDigits: asset?.decimals,
                    })
                  : formatPercent(Number(changeValue ?? 0))
              return (
                <Button
                  key={idx}
                  size="xs"
                  variant="ghost"
                  className="text-sm font-medium whitespace-nowrap !gap-1 tabular-nums"
                  onClick={() => setActiveAsset(asset.name)}
                >
                  {asset?.symbol}
                  <div
                    className={classNames(
                      getTextColorClass(changeValue ? Number(changeValue) : 0),
                    )}
                  >
                    {displayType === 'percentage'
                      ? getSignForValue(Number(changeValue ?? 0))
                      : null}
                    {formattedValue}
                  </div>
                </Button>
              )
            })}
          </div>
        ) : null}
      </OverflowX>
      {/* </div> */}
    </Card>
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
