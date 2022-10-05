import { classNames } from '@sushiswap/ui'
import { FC, ReactNode } from 'react'

import { defaultSidePadding } from '../helpers'
import { ViewAllButton } from './ViewAllButton'

interface AdditionalArticles {
  title: string
  children?: ReactNode
  className?: string
}

export const AdditionalArticles: FC<AdditionalArticles> = ({ title, children, className }) => {
  return (
    <div className={classNames('max-w-6xl mx-auto', className)}>
      <div className={classNames('flex justify-between', defaultSidePadding)}>
        <span className="text-xl font-bold sm:text-2xl">{title}</span>
        <ViewAllButton onClick={() => null} className="" isSmall />
      </div>
      <div className={classNames('overflow-x-auto lg:overflow-hidden pb-10', defaultSidePadding)}>
        <div className="gap-5 mt-6 sm:mt-10 sm:gap-6 grid grid-cols-3 min-w-[898px] sm:w-full">{children}</div>
      </div>
      <div className={classNames('hidden sm:flex justify-center', defaultSidePadding)}>
        <ViewAllButton as="a" href="/academy/articles" />
      </div>
    </div>
  )
}
