import { ChevronRightIcon, HomeIcon } from '@heroicons/react/solid'
import { Typography } from '@sushiswap/ui'
import Link from 'next/link'
import { FC } from 'react'

export type BreadcrumbLink = {
  href: string
  label: string
}

interface Breadcrumb {
  links: BreadcrumbLink[]
}

export const Breadcrumb: FC<Breadcrumb> = ({ links }) => {
  return (
    <div className="flex items-center gap-2 mt-4">
      <Link href="/dashboard" passHref={true}>
        <a className="flex items-center gap-2 group">
          <HomeIcon width={16} className="cursor-pointer group-hover:text-slate-50 text-slate-600" />
        </a>
      </Link>
      {links
        .map((link, index) => {
          const last = links.length === index + 1
          if (last) {
            return (
              <Typography key={`index-${link.label}`} variant="sm" weight={500} className="text-slate-300">
                {link.label}
              </Typography>
            )
          }

          return (
            <Link href={link.href} passHref={true} key={`index-${link.label}`}>
              <a className="flex items-center gap-2 group">
                <Typography
                  variant="sm"
                  weight={500}
                  className="cursor-pointer group-hover:text-slate-50 text-slate-600"
                >
                  {link.label}
                </Typography>
              </a>
            </Link>
          )
        })
        .reduce<JSX.Element[]>(
          (prev, cur, index) => [...prev, <ChevronRightIcon width={24} className="text-slate-600" key={index} />, cur],
          []
        )}
    </div>
  )
}
