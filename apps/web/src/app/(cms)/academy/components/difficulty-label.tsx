import type { AcademyArticle } from '@sushiswap/graph-client/strapi'
import { classNames } from '@sushiswap/ui'
import { CircleIcon } from '@sushiswap/ui/icons/CircleIcon'
import { DIFFICULTY_ELEMENTS } from '../contants'

interface DifficultyLabel {
  article: AcademyArticle
  isCard?: boolean
}
export function DifficultyLabel({ article, isCard }: DifficultyLabel) {
  const difficulty = article.difficulty

  if (!difficulty) return <></>

  const slug = difficulty.slug as keyof typeof DIFFICULTY_ELEMENTS
  if (!slug) return <></>

  const { color } = DIFFICULTY_ELEMENTS[slug]

  return (
    <div className="flex items-center gap-1.5">
      <CircleIcon width={8} height={8} stroke={color} fill={color} />
      <span
        className={classNames(
          isCard
            ? 'text-xs font-medium'
            : 'text-xs font-medium sm:text-sm sm:font-normal',
        )}
      >
        {difficulty?.label}
      </span>
    </div>
  )
}
