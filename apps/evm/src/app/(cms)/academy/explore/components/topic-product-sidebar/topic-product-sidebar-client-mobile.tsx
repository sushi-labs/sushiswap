'use client'

import { ChevronDownIcon } from '@heroicons/react-v1/solid'
import { classNames } from '@sushiswap/ui'
import { useMemo, useState } from 'react'
import type { TopicProductBarClientGeneric } from './topic-product-sidebar-client'

interface SidebarEntry {
  category: TopicProductBarClientGeneric['categories'][number]
  selectedValue: string | undefined
  setValue: TopicProductBarClientGeneric['setValue']
}

function SidebarEntry({ category, setValue, selectedValue }: SidebarEntry) {
  return (
    <div
      className={classNames(
        'font-medium w-[160px] max-w-fit',
        category.slug === selectedValue
          ? 'dark:text-gray-100'
          : 'dark:text-gray-400 text-[#7F7F7F] dark:hover:text-gray-300',
      )}
      onClick={() => setValue(category.slug)}
      onKeyUp={() => setValue(category.slug)}
    >
      {category.name}
    </div>
  )
}

export function TopicProductBarClientMobile({
  categories,
  selectedValue,
  setValue,
  className,
}: TopicProductBarClientGeneric) {
  const [open, setOpen] = useState(false)

  const selectedCategoryName = useMemo(() => {
    const category = categories.find((c) => c.slug === selectedValue)
    return category?.name
  }, [categories, selectedValue])

  return (
    <div
      className={classNames(
        'font-semibold text-sm transition-[height] border py-3 px-[18px] rounded-lg border-transparent',
        'bg-secondary',
        className,
      )}
    >
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setOpen(!open)}
        onKeyUp={() => setOpen(!open)}
      >
        <span>{selectedCategoryName || 'Select category'}</span>
        <div
          className={classNames(
            open && 'rotate-180',
            'transition-all text-[#4D5562] h-6 w-6',
          )}
        >
          <ChevronDownIcon />
        </div>
      </div>
      <div
        className={classNames(
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
          'transition-[grid-template-rows] grid [&>*]:overflow-hidden',
        )}
      >
        <div className="space-y-3">
          <div className="h-3" />
          {categories.map((category) => (
            <div
              key={category.name}
              onClick={() => setOpen(!open)}
              onKeyUp={() => setOpen(!open)}
            >
              <SidebarEntry
                category={category}
                selectedValue={selectedValue}
                setValue={setValue}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
