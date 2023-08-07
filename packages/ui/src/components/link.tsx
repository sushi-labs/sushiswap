import Link from 'next/link'
import { AnchorHTMLAttributes, FC } from 'react'

const LinkInternal = Link
const LinkExternal: FC<AnchorHTMLAttributes<HTMLAnchorElement>> = ({
  target = '_blank',
  rel = 'noopener noreferrer',
  ...props
}) => {
  return <a {...props} target={target} rel={rel} />
}

export { LinkExternal, LinkInternal }
