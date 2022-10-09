import { CircleIcon } from '@sushiswap/ui'
import { difficultyElements } from 'common/helpers'
import { Dispatch, FC, SetStateAction } from 'react'

import { DifficultyEntity } from '../../.mesh'

interface Difficulties {
  selected: DifficultyEntity
  onSelect: Dispatch<SetStateAction<DifficultyEntity>>
  difficulties: DifficultyEntity[]
}

export const Difficulties: FC<Difficulties> = ({ difficulties, selected, onSelect }) => {
  return (
    <>
      {difficulties.map((difficulty, i) => {
        const slug = difficulty.attributes?.slug
        if (!slug) return <></>
        const { color } = difficultyElements[slug]

        return (
          <button
            key={i}
            onClick={() => onSelect(difficulty)}
            className="text-sm px-4 font-semibold h-[38px] rounded-lg flex items-center gap-2.5 border hover:opacity-90"
            style={{
              borderColor: selected?.id === difficulty.id ? color : 'transparent',
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
