'use client'

import type { Product, Topic } from '@sushiswap/graph-client/strapi'
import { Button, classNames } from '@sushiswap/ui'
import { useCallback, useState } from 'react'
import {
  useAcademySearch,
  useSetAcademySearch,
} from '../academy-search-provider'

interface TopicProductBarClient {
  categories: (Topic | Product)[]
}

export function TopicProductBarClient({ categories }: TopicProductBarClient) {
  const { category: selectedCategory } = useAcademySearch()
  const setFilters = useSetAcademySearch()

  const [value, setValue] = useState<string | undefined>(selectedCategory)

  const FilterButton = ({ category }: { category: Topic | Product }) => {
    const isSelected = value === category.slug

    const onClick = useCallback(() => {
      const newCategory = isSelected ? undefined : category.slug

      setValue(newCategory)

      setFilters((filters) => {
        return {
          ...filters,
          category: newCategory,
        }
      })
    }, [isSelected, category.slug])

    return (
      <Button
        onClick={onClick}
        className={classNames('text-sm', !isSelected && 'bg-opacity-75')}
      >
        {category.name}
      </Button>
    )
  }

  return (
    <div className="flex-wrap gap-3 flex sm:gap-4 mt-9 sm:mt-8">
      {categories.map((category) => (
        <FilterButton key={category.slug} category={category} />
      ))}
    </div>
  )
}
