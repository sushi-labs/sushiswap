import { useLocalStorage } from '@sushiswap/hooks'
import { useCallback, useMemo } from 'react'
import { IS_PERPS_TESTNET } from '../config'

const FAVORITES_STORAGE_KEY = IS_PERPS_TESTNET
  ? `sushi.perps.favorites.testnet`
  : `sushi.perps.favorites`
export const useFavoriteAssets = () => {
  const [favorites, setFavorites] = useLocalStorage<string[]>(
    FAVORITES_STORAGE_KEY,
    [],
  )

  const handleFavorite = useCallback(
    (asset: string) => {
      setFavorites((current) => {
        if (current.includes(asset)) {
          return current.filter((fav) => fav !== asset)
        } else {
          return [...current, asset]
        }
      })
    },
    [setFavorites],
  )

  const hasFavorited = useCallback(
    (asset: string) => {
      return favorites.includes(asset)
    },
    [favorites],
  )

  const favoriteSet = useMemo(() => new Set(favorites), [favorites])

  return { favorites, favoriteSet, handleFavorite, hasFavorited }
}
