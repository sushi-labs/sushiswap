import { ChevronLeftIcon, XIcon } from '@heroicons/react/outline'
import { classNames, Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { Theme } from '../../types'

interface OverlayHeader {
  title: string
  theme: Theme
  onClose(): void
}

export const OverlayHeader: FC<OverlayHeader> = ({ theme, title, onClose }) => {
  return (
    <div className="flex items-start justify-between">
      <div aria-hidden="true" className="cursor-pointer flex gap-2 items-center" onClick={onClose}>
        <div className="rounded-full flex items-center justify-center cursor-pointer">
          <ChevronLeftIcon
            width={24}
            height={24}
            className={classNames(theme.primary.default, theme.primary.hover, 'cursor-pointer ')}
          />
        </div>
        <Typography
          weight={700}
          as="h3"
          className={classNames(theme.primary.default, theme.primary.hover, 'flex gap-4 text-lg font-bold leading-6 ')}
        >
          {title}
        </Typography>
      </div>
      {onClose ? (
        <div aria-hidden="true" className="flex items-center justify-center cursor-pointer" onClick={onClose}>
          <XIcon width={24} height={24} className={classNames(theme.primary.default, theme.primary.hover, '')} />
        </div>
      ) : (
        <span />
      )}
    </div>
  )
}
