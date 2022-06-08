import { classNames } from '@sushiswap/ui'
import { FC } from 'react'

import { Theme } from '../types'

interface Caption {
  className?: string
  theme: Theme
}

export const Caption: FC<Caption> = ({ className, theme }) => {
  return (
    <div
      className={classNames(
        className,
        theme.secondary.default,
        theme.secondary.hover,
        'flex items-center justify-center gap-2 cursor-pointer'
      )}
    >
      {/* <Link href="https://app.sushi.com" passHref={true}>
        <a className={classNames(theme.secondary.default, theme.secondary.hover, 'py-1 text-xs select-none')}>
          Powered by <span className="font-bold">Sushi</span>
        </a>
      </Link> */}
    </div>
  )
}
