'use client'

import {
  useAcademySearch,
  useSetAcademySearch,
} from '../../../components/academy-search-provider'
import type { FilterOption } from '../../../filter-options'
import { TopicProductBarClientDesktop } from './topic-product-sidebar-client-desktop'
import { TopicProductBarClientMobile } from './topic-product-sidebar-client-mobile'

interface TopicProductBarClient {
  categories: FilterOption[]
}

export interface TopicProductBarClientGeneric {
  categories: FilterOption[]
  selectedValue: string | undefined
  setValue: (value: string) => void
  className?: string
}

export function TopicProductSidebarClient({
  categories,
}: TopicProductBarClient) {
  const { category: selectedCategory } = useAcademySearch()
  const setFilters = useSetAcademySearch()

  function onSelect(slug: string) {
    setFilters((filters) => ({
      ...filters,
      category: selectedCategory === slug ? undefined : slug,
    }))
  }

  return (
    <>
      <TopicProductBarClientMobile
        categories={categories}
        selectedValue={selectedCategory}
        setValue={onSelect}
        className="block md:hidden"
      />
      <TopicProductBarClientDesktop
        categories={categories}
        selectedValue={selectedCategory}
        setValue={onSelect}
        className="hidden md:flex"
      />
    </>
  )
}
