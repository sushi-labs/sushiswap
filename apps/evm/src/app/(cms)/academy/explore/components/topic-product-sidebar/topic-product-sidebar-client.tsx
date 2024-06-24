'use client'

import type { Product, Topic } from '@sushiswap/graph-client/strapi'
import { classNames } from '@sushiswap/ui'
import { useCallback, useState } from 'react'
import {
  useAcademySearch,
  useSetAcademySearch,
} from '../../../components/academy-search-provider'

interface TopicProductBarClient {
  categories: (Topic | Product)[]
}

export function TopicProductSidebarClient({
  categories,
}: TopicProductBarClient) {
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
      <div
        onClick={onClick}
        onKeyDown={onClick}
        className={classNames(
          'text-sm w-full cursor-pointer rounded-xl hover:bg-blue hover:bg-opacity-70 px-4 py-2',
          isSelected && 'bg-blue bg-opacity-80',
        )}
      >
        {category.name}
      </div>
    )
  }

  return (
    <div className="flex-wrap gap-2 flex sm:gap-1">
      {categories.map((category) => (
        <FilterButton key={category.slug} category={category} />
      ))}
    </div>
  )
}
