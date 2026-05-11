import { Button, classNames } from '@sushiswap/ui'
import { useMemo } from 'react'
import { useFavoriteAssets } from 'src/lib/perps'
import { FavoriteIcon } from '../_common'

export const FavoriteButton = ({
  assetString,
  variant = 'ghost',
  size = 'xs',
}: {
  assetString: string
  variant?: 'perps-secondary' | 'ghost'
  size?: 'xs' | 'sm'
}) => {
  const { hasFavorited, handleFavorite } = useFavoriteAssets()
  const _hasFavorited = useMemo(
    () => hasFavorited(assetString),
    [assetString, hasFavorited],
  )
  return (
    <Button
      name="perps-fav-btn"
      variant={variant}
      size={size}
      className={classNames('transition-colors duration-300')}
      onClick={(e) => {
        e.stopPropagation()
        handleFavorite(assetString)
      }}
    >
      <FavoriteIcon
        isSelected={_hasFavorited}
        className={classNames(
          size === 'xs'
            ? 'min-h-[14px] h-[14px] min-w-[14px] w-[14px]'
            : 'min-h-[18px] h-[18px] min-w-[18px] w-[18px]',
        )}
      />
    </Button>
  )
}
