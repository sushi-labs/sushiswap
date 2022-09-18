import { classNames, Typography } from '@sushiswap/ui'
import { defaultSidePadding } from 'pages'
import { FC, ReactNode } from 'react'

interface AdditionalArticles {
  title: string
  children?: ReactNode
  className?: string
}

export const AdditionalArticles: FC<AdditionalArticles> = ({ title, children, className }) => {
  return (
    <div className={className}>
      <Typography variant="h3" weight={700} className={defaultSidePadding}>
        {title}
      </Typography>
      <div className={classNames('overflow-x-auto pb-8', defaultSidePadding)}>
        <div className="flex gap-6 mt-6 sm:mt-12 transition-all sm:gap-4 md:grid md:grid-cols-3 w-[888px] md:w-full">
          {children}
        </div>
      </div>
    </div>
  )
}
