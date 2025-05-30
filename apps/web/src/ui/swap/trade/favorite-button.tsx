import { StarIcon } from '@heroicons/react-v1/solid'
import { classNames } from '@sushiswap/ui'
import { type FC, useState } from 'react'

interface FavoriteButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
}

export const FavoriteButton: FC<FavoriteButtonProps> = ({
  className,
  ...props
}) => {
  const [isFavorited, setIsFavorited] = useState(false)
  const toggleFavorite = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation()
    setIsFavorited((prev) => !prev)
  }
  return (
    <button
      {...props}
      className={classNames(
        'text-[#0000001F] dark:text-[#FFFFFF1F] p-2 hover:text-black/20 dark:hover:text-white/20 rounded-full flex items-center justify-center',
        'transition-colors duration-200 ease-in-out',
        className,
      )}
      onClick={toggleFavorite}
      aria-label="Toggle Favorite"
      type="button"
    >
      <StarIcon
        width={18}
        height={18}
        className={classNames(isFavorited ? 'text-yellow' : '')}
      />
    </button>
  )
}
