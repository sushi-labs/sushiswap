import { StarIcon } from '@heroicons/react-v1/solid'
import { classNames } from '@sushiswap/ui'
import { useState } from 'react'

export const FavoriteButton = () => {
  const [isFavorited, setIsFavorited] = useState(false)
  const toggleFavorite = () => {
    setIsFavorited((prev) => !prev)
  }
  return (
    <button
      className={classNames(
        'text-[#0000001F] dark:text-[#FFFFFF1F] p-2 hover:text-black/20 dark:hover:text-white/20 rounded-full flex items-center justify-center',
        'transition-colors duration-200 ease-in-out',
      )}
      onClick={toggleFavorite}
      aria-label="Toggle Favorite"
      type="button"
    >
      <StarIcon
        width={16}
        height={16}
        className={classNames(isFavorited ? 'text-yellow' : '')}
      />
    </button>
  )
}
