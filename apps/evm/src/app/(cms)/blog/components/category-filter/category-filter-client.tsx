'use client'

import { Toggle } from '@sushiswap/ui'
import { useCallback } from 'react'
import { Category } from 'src/app/(cms)/lib/strapi/categories'
import { useBlogSearch, useSetBlogSearch } from '../blog-search-provider'

interface CategoryFilterClient {
  categories: Category[]
}

export function CategoryFilterClient({ categories }: CategoryFilterClient) {
  const { categories: selectedCategories } = useBlogSearch()
  const setSearch = useSetBlogSearch()

  const handleSelect = useCallback(
    (slug: string) => {
      const operation = selectedCategories?.includes(slug) ? 'remove' : 'add'

      if (operation === 'add') {
        setSearch((prev) => ({
          ...prev,
          categories: [...(prev.categories || []), slug],
        }))
      } else {
        setSearch((prev) => ({
          ...prev,
          categories: prev.categories!.filter((el) => el !== slug),
        }))
      }
    },
    [setSearch, selectedCategories],
  )

  return (
    <div className="gap-3 w-full flex flex-wrap">
      {categories.map((category) => {
        return (
          <Toggle
            key={category.id}
            onPressedChange={() => {
              handleSelect(category.slug)
            }}
            pressed={Boolean(selectedCategories?.includes(category.slug))}
          >
            {category.name}
          </Toggle>
        )
      })}
    </div>
  )
}
