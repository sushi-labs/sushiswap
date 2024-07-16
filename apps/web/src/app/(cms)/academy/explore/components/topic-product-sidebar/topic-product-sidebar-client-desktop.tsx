'use client'

import { classNames } from '@sushiswap/ui'
import { useCallback } from 'react'
import type { TopicProductBarClientGeneric } from './topic-product-sidebar-client'

export function TopicProductBarClientDesktop({
  categories,
  selectedValue,
  setValue,
  className,
}: TopicProductBarClientGeneric) {
  const FilterButton = useCallback(
    ({
      category,
    }: { category: TopicProductBarClientGeneric['categories'][number] }) => {
      const isSelected = selectedValue === category.slug

      return (
        <div
          onClick={() => setValue(category.slug)}
          onKeyDown={() => setValue(category.slug)}
          className={classNames(
            'text-sm w-full cursor-pointer rounded-xl hover:bg-blue hover:bg-opacity-70 px-4 py-2',
            isSelected && 'bg-blue bg-opacity-80',
          )}
        >
          {category.name}
        </div>
      )
    },
    [selectedValue, setValue],
  )

  return (
    <div className={classNames('flex-wrap gap-2 flex sm:gap-1', className)}>
      {categories.map((category) => (
        <FilterButton key={category.slug} category={category} />
      ))}
    </div>
  )
}
