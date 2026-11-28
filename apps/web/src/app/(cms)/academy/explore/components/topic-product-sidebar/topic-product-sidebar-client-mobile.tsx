'use client'

import { ChevronDownIcon } from '@heroicons/react-v1/solid'
import { classNames } from '@sushiswap/ui'
import { useState } from 'react'
import type { TopicProductBarClientGeneric } from './topic-product-sidebar-client'

export function TopicProductBarClientMobile({
  categories,
  selectedValue,
  setValue,
  className,
}: TopicProductBarClientGeneric) {
  const [open, setOpen] = useState(false)

  const selectedCategory = categories.find(({ slug }) => slug === selectedValue)

  return (
    <div
      className={classNames(
        'font-semibold text-sm transition-[height] border py-3 px-[18px] rounded-lg border-transparent',
        'bg-secondary',
        className,
      )}
    >
      <button
        type="button"
        aria-expanded={open}
        className="flex w-full justify-between items-center cursor-pointer"
        onClick={() => setOpen((open) => !open)}
      >
        <span>{selectedCategory?.name ?? 'Select category'}</span>
        <span
          className={classNames(
            open && 'rotate-180',
            'transition-all text-[#4D5562] h-6 w-6',
          )}
        >
          <ChevronDownIcon />
        </span>
      </button>
      <div
        inert={!open}
        className={classNames(
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
          'transition-[grid-template-rows] grid [&>*]:overflow-hidden',
        )}
      >
        <div className="space-y-3">
          <div className="h-3" />
          {categories.map(({ name, slug }) => (
            <button
              key={slug}
              type="button"
              aria-pressed={slug === selectedValue}
              onClick={() => {
                setValue(slug)
                setOpen(false)
              }}
              className={classNames(
                'block text-left font-medium w-[160px] max-w-fit',
                slug === selectedValue
                  ? 'dark:text-gray-100'
                  : 'dark:text-gray-400 text-[#7F7F7F] dark:hover:text-gray-300',
              )}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
