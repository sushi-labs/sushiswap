import classNames from 'classnames'
import React, { FC, HTMLProps, useCallback } from 'react'

const COLOR = {
  primary: 'hover:text-white hover:underline focus:text-white active:text-white',
  blue: 'text-blue',
}

export type Color = 'primary' | 'blue'

export interface ExternalLinkProps extends Omit<HTMLProps<HTMLAnchorElement>, 'as' | 'ref' | 'onClick'> {
  color?: Color
  startIcon?: JSX.Element
  endIcon?: JSX.Element
}

export const External: FC<ExternalLinkProps> = ({
  target = '_blank',
  href,
  children,
  rel = 'noopener noreferrer',
  className = '',
  color = 'primary',
  startIcon = undefined,
  endIcon = undefined,
  ...rest
}) => {
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      // don't prevent default, don't redirect if it's a new tab
      if (target === '_blank' || event.ctrlKey || event.metaKey) {
        event.stopPropagation()
        // window.gtag('event', href, {
        //   event_category: 'Outbound Link',
        //   event_label: href,
        //   event_callback: () => {
        //     console.debug('Fired outbound link event', href)
        //   },
        // })
      } else {
        event.preventDefault()
        // send a gtag event and then trigger a location change

        // window.gtag('event', href, {
        //   event_category: 'Outbound Link',
        //   event_label: href,
        //   event_callback: () => {
        //     window.location.href = href
        //   },
        // })
      }
    },
    [target]
  )
  return (
    <a
      target={target}
      rel={rel}
      href={href}
      onClick={handleClick}
      className={classNames(
        ' whitespace-nowrap',
        COLOR[color],
        (startIcon || endIcon) && 'space-x-1 flex items-center justify-center',
        className
      )}
      {...rest}
    >
      {startIcon && startIcon}
      {children}
      {endIcon && endIcon}
    </a>
  )
}
