import { IconButton, classNames } from '@sushiswap/ui'
import { useMemo } from 'react'
import { useFavoriteAssets } from 'src/lib/perps'
import { FavoriteIcon } from '../_common'

export const FavoriteButton = ({
  assetString,
}: {
  assetString: string
}) => {
  const { hasFavorited, handleFavorite } = useFavoriteAssets()
  const _hasFavorited = useMemo(
    () => hasFavorited(assetString),
    [assetString, hasFavorited],
  )
  return (
    <IconButton
      name="perps-fav-btn"
      icon={FavoriteIcon}
      variant="ghost"
      size="xs"
      iconProps={{
        // @ts-expect-error: isSelected is not typed on SVGProps
        isSelected: _hasFavorited,
      }}
      className={classNames('transition-colors duration-300')}
      onClick={(e) => {
        e.stopPropagation()
        handleFavorite(assetString)
      }}
    />
  )
}
