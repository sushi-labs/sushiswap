'use client'

import type { Product, Topic } from '@sushiswap/graph-client/strapi'
import { useCallback, useState } from 'react'
import {
  useAcademySearch,
  useSetAcademySearch,
} from '../../../components/academy-search-provider'
import { TopicProductBarClientDesktop } from './topic-product-sidebar-client-desktop'
import { TopicProductBarClientMobile } from './topic-product-sidebar-client-mobile'

interface TopicProductBarClient {
  categories: (Topic | Product)[]
}

export interface TopicProductBarClientGeneric {
  categories: (Topic | Product)[]
  selectedValue: string | undefined
  setValue: (value: string) => void
  className?: string
}

export function TopicProductSidebarClient({
  categories,
}: TopicProductBarClient) {
  const { category: selectedCategory } = useAcademySearch()
  const setFilters = useSetAcademySearch()

  const [value, setValue] = useState<string | undefined>(selectedCategory)

  const onSelect = useCallback(
    (categorySlug: string) => {
      const isSelected = categorySlug === value

      const newCategory = isSelected ? undefined : categorySlug
      setValue(newCategory)

      setFilters((filters) => {
        return {
          ...filters,
          category: newCategory,
        }
      })
    },
    [setFilters, value],
  )

  return (
    <>
      <TopicProductBarClientMobile
        categories={categories}
        selectedValue={value}
        setValue={onSelect}
        className="block md:hidden"
      />
      <TopicProductBarClientDesktop
        categories={categories}
        selectedValue={value}
        setValue={onSelect}
        className="hidden md:flex"
      />
    </>
  )
}
