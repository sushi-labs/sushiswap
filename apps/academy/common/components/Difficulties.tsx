import { CircleIcon } from '@sushiswap/ui'
import { difficultyColors } from 'common/helpers'
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
        if (!difficulty.id) return <></>

        return (
          <button
            key={i}
            onClick={() => onSelect(difficulty)}
            className="text-sm px-4 font-semibold h-[38px] rounded-lg flex items-center gap-2.5 border"
            style={{
              borderColor: selected?.id === difficulty.id ? difficultyColors[i] : 'transparent',
              background: `${difficultyColors[i]}33`,
            }}
          >
            <CircleIcon fill={difficultyColors[i]} stroke={difficultyColors[i]} width={8} height={8} />
            {difficulty.attributes?.name}
          </button>
        )
      })}
    </>
  )
}
