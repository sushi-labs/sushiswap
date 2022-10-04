import { useRouter } from 'next/router'
import { FC } from 'react'

import { classNames, Link } from '..'

export interface NavItemProps {
  href: string
  label: string
  external?: boolean
}

export const NavItemInternal: FC<NavItemProps> = ({ href, label }) => {
  const { basePath } = useRouter()

  return (
    <Link.Internal href={href}>
      <span
        className={classNames(
          href === basePath ? 'text-slate-50' : 'text-slate-300',
          'text-sm font-semibold text-slate-400 hover:text-slate-50 cursor-pointer'
        )}
      >
        {label}
      </span>
    </Link.Internal>
  )
}

export const NavItemExternal: FC<NavItemProps> = ({ href, label }) => {
  const { basePath } = useRouter()

  return (
    <Link.External href={href}>
      <span
        className={classNames(
          href === basePath ? 'text-slate-50' : 'text-slate-300',
          'text-sm font-semibold text-slate-400 hover:text-slate-50 cursor-pointer'
        )}
      >
        {label}
      </span>
    </Link.External>
  )
}

export const NavItem: FC<NavItemProps> = ({ href, label }) => {
  const { basePath } = useRouter()

  return (
    <a href={href}>
      <span
        className={classNames(
          href === basePath ? 'text-slate-50' : 'text-slate-300',
          'text-sm font-semibold text-slate-400 hover:text-slate-50 cursor-pointer'
        )}
      >
        {label}
      </span>
    </a>
  )
}
