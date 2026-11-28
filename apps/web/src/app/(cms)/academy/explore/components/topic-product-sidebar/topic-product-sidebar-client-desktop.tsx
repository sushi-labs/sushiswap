'use client'

import { classNames } from '@sushiswap/ui'
import type { TopicProductBarClientGeneric } from './topic-product-sidebar-client'

export function TopicProductBarClientDesktop({
  categories,
  selectedValue,
  setValue,
  className,
}: TopicProductBarClientGeneric) {
  return (
    <div className={classNames('flex-wrap gap-2 flex sm:gap-1', className)}>
      {categories.map(({ name, slug }) => (
        <button
          key={slug}
          type="button"
          aria-pressed={selectedValue === slug}
          onClick={() => setValue(slug)}
          className={classNames(
            'text-sm text-left w-full cursor-pointer rounded-xl hover:bg-blue hover:bg-opacity-70 px-4 py-2',
            selectedValue === slug && 'bg-blue bg-opacity-80',
          )}
        >
          {name}
        </button>
      ))}
    </div>
  )
}
