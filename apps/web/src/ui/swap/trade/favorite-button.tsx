import { StarIcon } from '@heroicons/react-v1/solid'
import { type PinnedTokenId, usePinnedTokens } from '@sushiswap/hooks'
import { classNames } from '@sushiswap/ui'
import type { FC } from 'react'

interface FavoriteButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  currencyId: PinnedTokenId
}

export const FavoriteButton: FC<FavoriteButtonProps> = ({
  className,
  currencyId,
  ...props
}) => {
  const { hasToken, mutate } = usePinnedTokens()
  const isOnList = !currencyId ? false : hasToken(currencyId)

  const toggleFavorite = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation()
    if (!currencyId) return
    mutate(isOnList ? 'remove' : 'add', currencyId)
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
      onKeyDown={toggleFavorite}
      aria-label="Toggle Favorite"
      type="button"
    >
      <StarIcon
        width={18}
        height={18}
        className={classNames(isOnList ? 'text-yellow' : '')}
      />
    </button>
  )
}
