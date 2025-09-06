'use client'

import { InterfaceEventName, sendAnalyticsEvent } from '@sushiswap/telemetry'
import classNames from 'classnames'
import Link from 'next/link'
import type { AnchorHTMLAttributes, FC } from 'react'

const LinkInternal = Link
const LinkExternal: FC<AnchorHTMLAttributes<HTMLAnchorElement>> = ({
  target = '_blank',
  rel = 'noopener noreferrer',
  ...props
}) => {
  return (
    <button
      onClick={() =>
        sendAnalyticsEvent(InterfaceEventName.EXTERNAL_LINK_CLICK, {
          label: props.href,
        })
      }
      type="button"
    >
      <a
        {...props}
        target={target}
        rel={rel}
        className={classNames(
          'cursor-pointer text-blue hover:underline',
          props.className,
        )}
      />
    </button>
  )
}

export { LinkExternal, LinkInternal }
