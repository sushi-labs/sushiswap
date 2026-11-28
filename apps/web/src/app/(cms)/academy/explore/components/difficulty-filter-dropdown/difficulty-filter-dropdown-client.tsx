'use client'

import { XMarkIcon } from '@heroicons/react/24/solid'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  classNames,
} from '@sushiswap/ui'
import {
  useAcademySearch,
  useSetAcademySearch,
} from '../../../components/academy-search-provider'
import type { FilterOption } from '../../../filter-options'

interface DifficultyFilterDropdownClient {
  difficulties: FilterOption[]
}

export function DifficultyFilterDropdownClient({
  difficulties,
}: DifficultyFilterDropdownClient) {
  const { difficulty: selectedDifficulty } = useAcademySearch()
  const setFilters = useSetAcademySearch()

  const selectedOption = difficulties.find(
    ({ slug }) => slug === selectedDifficulty,
  )

  function selectDifficulty(difficulty?: string) {
    setFilters((filters) => ({ ...filters, difficulty }))
  }

  return (
    <div className="flex gap-2 items-center justify-center w-full">
      <Select
        value={selectedOption?.slug ?? ''}
        onValueChange={selectDifficulty}
      >
        <SelectTrigger>
          <span
            className={classNames(
              !selectedOption && 'text-slate-400 font-normal',
            )}
          >
            {selectedOption?.name ?? 'Select difficulty'}
          </span>
        </SelectTrigger>
        <SelectContent>
          {difficulties.map(({ name, slug }) => (
            <SelectItem key={slug} value={slug} title={name}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <button
        type="button"
        aria-label="Clear difficulty filter"
        className={classNames(
          'md:h-5 h-[18px] md:w-5 w-[18px]',
          !selectedOption && 'invisible',
        )}
        onClick={() => selectDifficulty()}
      >
        <XMarkIcon />
      </button>
    </div>
  )
}
