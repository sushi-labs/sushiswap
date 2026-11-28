'use client'

import { CircleIcon } from '@sushiswap/ui/icons/circle-icon'
import { DIFFICULTY_ELEMENTS } from '../../constants'
import type { StyledDifficulty } from '../../filter-options'
import {
  useAcademySearch,
  useSetAcademySearch,
} from '../academy-search-provider'

interface DifficultyFilterBarClient {
  difficulties: StyledDifficulty[]
}

export function DifficultyFilterBarClient({
  difficulties,
}: DifficultyFilterBarClient) {
  const { difficulty: selectedDifficulty } = useAcademySearch()
  const setFilters = useSetAcademySearch()

  return (
    <div className="items-center gap-8 flex flex-wrap">
      <span className="text-xl font-semibold">Difficulty:</span>
      <div className="flex flex-wrap gap-6">
        {difficulties.map(({ slug, name }) => {
          const { color } = DIFFICULTY_ELEMENTS[slug]
          const isSelected = selectedDifficulty === slug

          return (
            <button
              key={slug}
              type="button"
              aria-pressed={isSelected}
              onClick={() =>
                setFilters((filters) => ({
                  ...filters,
                  difficulty: isSelected ? undefined : slug,
                }))
              }
              className="text-sm px-4 font-semibold h-[38px] rounded-lg flex items-center gap-2.5 border hover:opacity-90"
              style={{
                borderColor: isSelected ? color : 'transparent',
                background: `${color}33`,
              }}
            >
              <CircleIcon fill={color} stroke={color} width={8} height={8} />
              {name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
