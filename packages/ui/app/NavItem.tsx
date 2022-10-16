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
      <a
        href={href}
        className={classNames(
          href === basePath ? 'text-slate-50' : 'text-slate-300',
          'text-sm font-semibold text-slate-400 hover:text-slate-50 cursor-pointer'
        )}
      >
        {label}
      </a>
    </Link.Internal>
  )
}

export const NavItemApp: FC<NavItemProps> = ({ href, label }) => {
  const { basePath } = useRouter()
  return (
    <a
      href={href}
      className={classNames(
        href === basePath ? 'text-slate-50' : 'text-slate-300',
        'text-sm font-semibold text-slate-400 hover:text-slate-50 cursor-pointer decoration-transparent'
      )}
    >
      {label}
    </a>
  )
}

export const NavItemExternal: FC<NavItemProps> = ({ href, label }) => {
  const { basePath } = useRouter()

  return (
    <Link.External href={href}>
      <a
        className={classNames(
          href === basePath ? 'text-slate-50' : 'text-slate-300',
          'text-sm font-semibold text-slate-400 hover:text-slate-50 cursor-pointer decoration-transparent'
        )}
      >
        {label}
      </a>
    </Link.External>
  )
}

export const NavItem: FC<NavItemProps> = ({ href, label }) => {
  const { basePath } = useRouter()

  return (
    <a
      href={href}
      className={classNames(
        href === basePath ? 'text-slate-50' : 'text-slate-300',
        'text-sm font-semibold text-slate-400 hover:text-slate-50 cursor-pointer'
      )}
    >
      {label}
    </a>
  )
}
