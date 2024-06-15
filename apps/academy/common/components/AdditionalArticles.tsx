import { PlusCircleIcon } from '@heroicons/react/24/solid'
import { Button, LinkInternal, classNames } from '@sushiswap/ui'
import { FC, ReactNode } from 'react'

import { DEFAULT_SIDE_PADDING } from '../helpers'

interface AdditionalArticles {
  title: string
  children?: ReactNode
  className?: string
}

export const AdditionalArticles: FC<AdditionalArticles> = ({
  title,
  children,
  className,
}) => {
  return (
    <div className={classNames('max-w-6xl mx-auto', className)}>
      <div className={classNames('flex justify-between', DEFAULT_SIDE_PADDING)}>
        <span className="text-xl font-bold sm:text-2xl">{title}</span>
        <Button
          icon={PlusCircleIcon}
          iconProps={{ fill: '#3B7EF6' }}
          variant="secondary"
          className="sm:hidden"
        >
          <LinkInternal href="/articles">View All</LinkInternal>
        </Button>
      </div>

      <div
        className={classNames(
          'overflow-x-auto pb-6 gap-5 pt-6 sm:pt-10 sm:gap-6 grid grid-cols-[repeat(auto-fill,minmax(286px,1fr))] scroll',
          DEFAULT_SIDE_PADDING,
        )}
      >
        {children}
      </div>
      <div
        className={classNames(
          'hidden sm:flex justify-center',
          DEFAULT_SIDE_PADDING,
        )}
      >
        <Button
          icon={PlusCircleIcon}
          iconProps={{ fill: '#3B7EF6' }}
          variant="secondary"
          className="hidden sm:flex"
        >
          <LinkInternal href="/articles">View All</LinkInternal>
        </Button>
      </div>
    </div>
  )
}
