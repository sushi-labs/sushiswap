'use client'

import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { usePathname, useSearchParams } from 'next/navigation'
import React, { Suspense } from 'react'

import classNames from 'classnames'
import { Button } from './button'
import { LinkInternal } from './link'

const Params = () => {
  const searchParams = useSearchParams()!

  return searchParams.toString().length !== 0 ? (
    <div className="px-2 text-gray-500">
      <span>?</span>
      {Array.from(searchParams.entries()).map(([key, value], index) => {
        return (
          <React.Fragment key={key}>
            {index !== 0 ? <span>&</span> : null}
            <span className="px-1">
              <span
                key={key}
                className="animate-[highlight_1s_ease-in-out_1] text-gray-100"
              >
                {key}
              </span>
              <span>=</span>
              <span
                key={value}
                className="animate-[highlight_1s_ease-in-out_1] text-gray-100"
              >
                {value}
              </span>
            </span>
          </React.Fragment>
        )
      })}
    </div>
  ) : null
}

export const Breadcrumb = () => {
  const pathname = usePathname()
  const items = pathname.split('/').slice(2)

  return (
    <div className="flex gap-x-1.5 items-center text-sm py-4">
      <Button
        variant="link"
        size="sm"
        className={classNames(
          '!font-normal hover:underline',
          pathname.split('/').length === 2
            ? '!text-gray-900 dark:!text-slate-50'
            : '!text-accent-foreground',
        )}
      >
        <LinkInternal href={`/${pathname.split('/')[1]}`}>Home</LinkInternal>
      </Button>

      {pathname ? (
        <>
          <ChevronRightIcon
            width={16}
            height={16}
            className="text-muted-foreground"
          />
          {items.map((segment, i) => {
            const segments = [...items]
              .map((s) => s.replace(/%3A/g, ':'))
              .slice(0, i + 1)
            return (
              <React.Fragment key={segment}>
                <Button
                  variant="link"
                  size="sm"
                  key={segment}
                  className={classNames(
                    'hover:underline !inline font-normal capitalize whitespace-nowrap max-w-[120px] truncate',
                    i < items.length - 1
                      ? '!font-normal !text-muted-foreground'
                      : '!font-medium !text-gray-900 dark:!text-slate-50',
                  )}
                >
                  <LinkInternal href={`/pool/${segments.join('/')}`}>
                    {segment.replace(/%3A/g, ':')}
                  </LinkInternal>
                </Button>

                {i < items.length - 1 ? (
                  <ChevronRightIcon
                    width={16}
                    height={16}
                    className="text-muted-foreground"
                  />
                ) : null}
              </React.Fragment>
            )
          })}
        </>
      ) : null}

      <Suspense>
        <Params />
      </Suspense>
    </div>
  )
}
