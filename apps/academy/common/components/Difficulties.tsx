import { DIFFICULTY_ELEMENTS } from 'common/helpers'
import { FC } from 'react'

import { CircleIcon } from '@sushiswap/ui/icons/CircleIcon'
import { DifficultyEntity } from '../../.mesh'

interface Difficulties {
  selected: DifficultyEntity
  onSelect: (difficulty: DifficultyEntity) => void
  difficulties: DifficultyEntity[]
}

export const Difficulties: FC<Difficulties> = ({
  difficulties,
  selected,
  onSelect,
}) => {
  return (
    <>
      {difficulties.map((difficulty, i) => {
        if (!difficulty?.attributes?.slug) return <></>
        const slug = difficulty.attributes
          .slug as keyof typeof DIFFICULTY_ELEMENTS
        const { color } = DIFFICULTY_ELEMENTS[slug]
        return (
          <button
            type="button"
            key={i}
            onClick={() => onSelect(difficulty)}
            className="text-sm px-4 font-semibold h-[38px] rounded-lg flex items-center gap-2.5 border hover:opacity-90"
            style={{
              borderColor:
                selected?.id === difficulty.id ? color : 'transparent',
              background: `${color}33`,
            }}
          >
            <CircleIcon fill={color} stroke={color} width={8} height={8} />
            {difficulty.attributes?.name}
          </button>
        )
      })}
    </>
  )
}
