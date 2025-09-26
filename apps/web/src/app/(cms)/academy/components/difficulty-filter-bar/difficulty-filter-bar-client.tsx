'use client'

import type { Difficulty } from '@sushiswap/graph-client/strapi'
import { CircleIcon } from '@sushiswap/ui/icons/CircleIcon'
import { useCallback, useState } from 'react'
import { DIFFICULTY_ELEMENTS } from '../../constants'
import {
  useAcademySearch,
  useSetAcademySearch,
} from '../academy-search-provider'

interface DifficultyFilterBarClient {
  difficulties: Difficulty[]
}

export function DifficultyFilterBarClient({
  difficulties,
}: DifficultyFilterBarClient) {
  const { difficulty: selectedDifficulty } = useAcademySearch()
  const setFilters = useSetAcademySearch()

  // Only allow one difficulty to be selected at a time
  const [value, setValue] = useState<string | undefined>(selectedDifficulty)

  const onSelect = useCallback(
    (difficulty: Difficulty) => {
      const newDifficulty =
        difficulty.slug === value ? undefined : difficulty.slug

      setValue(newDifficulty)

      setFilters((filters) => {
        return {
          ...filters,
          difficulty: newDifficulty,
        }
      })
    },
    [setFilters, value],
  )

  return (
    <div className="items-center gap-8 flex flex-wrap">
      <span className="text-xl font-semibold">Difficulty:</span>
      <div className="flex flex-wrap gap-6">
        {difficulties.map((difficulty) => {
          const slug = difficulty.slug as keyof typeof DIFFICULTY_ELEMENTS
          const { color } = DIFFICULTY_ELEMENTS[slug]

          return (
            <button
              key={difficulty.slug}
              type="button"
              onClick={() => onSelect(difficulty)}
              className="text-sm px-4 font-semibold h-[38px] rounded-lg flex items-center gap-2.5 border hover:opacity-90"
              style={{
                borderColor: value === difficulty.slug ? color : 'transparent',
                background: `${color}33`,
              }}
            >
              <CircleIcon fill={color} stroke={color} width={8} height={8} />
              {difficulty.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
