'use client'

import { Button, classNames } from '@sushiswap/ui'
import type { FilterOption } from '../../filter-options'
import {
  useAcademySearch,
  useSetAcademySearch,
} from '../academy-search-provider'

interface TopicProductBarClient {
  categories: FilterOption[]
}

export function TopicProductBarClient({ categories }: TopicProductBarClient) {
  const { category: selectedCategory } = useAcademySearch()
  const setFilters = useSetAcademySearch()

  return (
    <div className="flex-wrap gap-3 flex sm:gap-4 mt-9 sm:mt-8">
      {categories.map(({ slug, name }) => {
        const isSelected = selectedCategory === slug

        return (
          <Button
            key={slug}
            aria-pressed={isSelected}
            onClick={() =>
              setFilters((filters) => ({
                ...filters,
                category: isSelected ? undefined : slug,
              }))
            }
            className={classNames('text-sm', !isSelected && 'bg-opacity-75')}
          >
            {name}
          </Button>
        )
      })}
    </div>
  )
}
