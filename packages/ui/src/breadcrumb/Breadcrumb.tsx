import { ChevronRightIcon, HomeIcon } from '@heroicons/react/20/solid'
import { FC } from 'react'

import { Link, Typography } from '..'

export type BreadcrumbLink = {
  href: string
  label: string
}

interface Breadcrumb {
  home: string
  links: BreadcrumbLink[]
}

/**
 * @deprecated
 */
export const Breadcrumb: FC<Breadcrumb> = ({ links, home }) => {
  return (
    <div className="flex items-center gap-2 mt-4">
      <Link.Internal href={home} passHref={true}>
        <a className="flex items-center gap-2 group">
          <HomeIcon
            width={16}
            className="cursor-pointer dark:group-hover:text-slate-50 group-hover:text-gray-900 text-gray-500 dark:text-slate-600"
          />
        </a>
      </Link.Internal>
      {links
        .map((link, index) => {
          const last = links.length === index + 1
          if (last) {
            return (
              <Typography
                key={`index-${link.label}`}
                variant="sm"
                weight={500}
                className="text-gray-600 dark:text-slate-300"
              >
                {link.label}
              </Typography>
            )
          }

          return (
            <Link.Internal href={link.href} passHref={true} key={`index-${link.label}`}>
              <a className="flex items-center gap-2 group">
                <Typography
                  variant="sm"
                  weight={500}
                  className="cursor-pointer dark:group-hover:text-slate-50 group-hover:text-gray-900 text-gray-500 dark:text-slate-600"
                >
                  {link.label}
                </Typography>
              </a>
            </Link.Internal>
          )
        })
        .reduce<JSX.Element[]>(
          (prev, cur, index) => [
            ...prev,
            <ChevronRightIcon width={24} className="text-gray-500 dark:text-slate-600" key={index} />,
            cur,
          ],
          []
        )}
    </div>
  )
}
