'use client'

import { Toggle } from '@sushiswap/ui'
import { useCallback, useState } from 'react'
import type { Category } from 'src/app/(cms)/lib/strapi/categories'
import { useBlogSearch, useSetBlogSearch } from '../blog-search-provider'

interface CategoryFilterClient {
  categories: Category[]
}

export function CategoryFilterClient({ categories }: CategoryFilterClient) {
  const { categories: selectedCategories } = useBlogSearch()
  const setSearch = useSetBlogSearch()

  const [localCategories, setLocalCategories] = useState(selectedCategories)

  const handleSelect = useCallback(
    (slug: string) => {
      const operation = selectedCategories?.includes(slug) ? 'remove' : 'add'

      const prevToNew = (prev: string[], newSlug: string) => {
        if (operation === 'add') {
          return [...prev, newSlug]
        } else {
          return prev.filter((el) => el !== newSlug)
        }
      }

      setLocalCategories((prev) => prevToNew(prev || [], slug))

      setSearch((prev) => ({
        ...prev,
        categories: prevToNew(prev.categories || [], slug),
      }))
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
            pressed={Boolean(localCategories?.includes(category.slug))}
          >
            {category.name}
          </Toggle>
        )
      })}
    </div>
  )
}
