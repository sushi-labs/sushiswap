import { useRouter } from 'next/router'
import { FC } from 'react'

import { classNames } from '../index'

export interface NavItemProps {
  href: string
  label: string
  external?: boolean
}

export const NavItem: FC<NavItemProps> = ({ href, label, external = false }) => {
  const { basePath } = useRouter()

  return (
    <a href={href} {...(external ? { rel: 'noopener noreferrer', target: '_blank' } : {})}>
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
