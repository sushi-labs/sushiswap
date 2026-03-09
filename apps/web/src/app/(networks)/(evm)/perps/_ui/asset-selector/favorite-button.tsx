import { StarIcon } from '@heroicons/react-v1/solid'
import { IconButton, classNames } from '@sushiswap/ui'
import { useMemo } from 'react'
import { useFavoriteAssets } from 'src/lib/perps/user'

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
      icon={StarIcon}
      variant="ghost"
      size="xs"
      className={classNames(
        'transition-colors duration-300',
        _hasFavorited ? 'text-yellow-400' : 'text-muted-foreground',
      )}
      onClick={(e) => {
        e.stopPropagation()
        handleFavorite(assetString)
      }}
    />
  )
}
