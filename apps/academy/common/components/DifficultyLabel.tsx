import { classNames } from '@sushiswap/ui'
import { CircleIcon } from '@sushiswap/ui/components/icons'
import { DIFFICULTY_ELEMENTS } from 'common/helpers'
import { FC } from 'react'
import { Article } from 'types'

interface DifficultyLabel {
  article: Article
  isCard?: boolean
}
export const DifficultyLabel: FC<DifficultyLabel> = ({ article, isCard }) => {
  const difficulty = article.attributes?.difficulty?.data?.attributes

  const slug = difficulty?.slug as keyof typeof DIFFICULTY_ELEMENTS
  if (!slug) return <></>

  const { color } = DIFFICULTY_ELEMENTS[slug]

  return (
    <div className="flex items-center gap-1.5">
      <CircleIcon width={8} height={8} stroke={color} fill={color} />
      <span className={classNames(isCard ? 'text-xs font-medium' : 'text-xs font-medium sm:text-sm sm:font-normal')}>
        {difficulty?.label}
      </span>
    </div>
  )
}
