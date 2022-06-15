import Link, { LinkProps } from 'next/link'
import { FC } from 'react'

export type InternalLinkProps = LinkProps

export const Internal: FC<InternalLinkProps> = ({ href, ...rest }) => {
  return <Link href={href} {...rest} />
}
