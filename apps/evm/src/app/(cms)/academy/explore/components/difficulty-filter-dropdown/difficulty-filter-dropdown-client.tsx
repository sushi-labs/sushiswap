'use client'

import { XMarkIcon } from '@heroicons/react/24/solid'
import type { Difficulty } from '@sushiswap/graph-client/strapi'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  classNames,
} from '@sushiswap/ui'
import { useCallback, useState } from 'react'
import {
  useAcademySearch,
  useSetAcademySearch,
} from '../../../components/academy-search-provider'

interface DifficultyFilterDropdownClient {
  difficulties: Difficulty[]
}

export function DifficultyFilterDropdownClient({
  difficulties,
}: DifficultyFilterDropdownClient) {
  const { difficulty: selectedDifficulty } = useAcademySearch()
  const setFilters = useSetAcademySearch()

  const getNameFromSlug = useCallback(
    (slug: string | undefined) => {
      if (!slug) return undefined

      return difficulties.find((d) => d.slug === slug)!.name
    },
    [difficulties],
  )

  const getSlugFromName = useCallback(
    (name: string | undefined) => {
      if (!name) return undefined

      return difficulties.find((d) => d.name === name)!.slug
    },
    [difficulties],
  )

  const [value, setValue] = useState<string | undefined>(
    getNameFromSlug(selectedDifficulty),
  )

  const onSelect = useCallback(
    (difficultyName: string) => {
      const isSelected = difficultyName === value

      const newName = isSelected ? undefined : difficultyName
      setValue(newName)

      const difficultySlug = getSlugFromName(difficultyName)
      const newDifficulty = isSelected ? undefined : difficultySlug

      setFilters((filters) => {
        return {
          ...filters,
          difficulty: newDifficulty,
        }
      })
    },
    [getSlugFromName, setFilters, value],
  )

  return (
    <div className="flex gap-2 items-center justify-center w-full">
      <Select value={value || ''} onValueChange={onSelect}>
        <SelectTrigger>
          <span className={classNames(!value && 'text-slate-400 font-normal')}>
            {value || 'Select difficulty'}
          </span>
        </SelectTrigger>
        <SelectContent placeholder="Select Difficulty">
          {difficulties.map((difficulty) => (
            <SelectItem
              key={difficulty.slug}
              value={difficulty.name}
              title={difficulty.name}
              className="px-4 text-base"
            >
              {difficulty.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div
        className="h-5 w-5 !cursor-pointer"
        onClick={() => onSelect(value || '')}
        onKeyDown={() => onSelect(value || '')}
      >
        <XMarkIcon
          width={20}
          height={20}
          className={classNames(!value && 'hidden')}
        />
      </div>
    </div>
  )
}
