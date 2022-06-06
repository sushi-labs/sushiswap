import { ChevronRightIcon, HomeIcon } from '@heroicons/react/solid'
import { Typography } from '@sushiswap/ui'
import Link from 'next/link'
import { FC } from 'react'

interface Breadcrumb {
  title: string
}

export const Breadcrumb: FC<Breadcrumb> = ({ title }) => {
  return (
    <div className="flex items-center gap-3 mt-4">
      <Link href="/dashboard" passHref={true}>
        <a className="flex items-center gap-2 group">
          <HomeIcon width={16} className="cursor-pointer group-hover:text-slate-50 text-slate-400" />
          <Typography variant="sm" weight={700} className="cursor-pointer group-hover:text-slate-50 text-slate-400">
            Dashboard
          </Typography>
        </a>
      </Link>
      <ChevronRightIcon width={24} className="text-slate-400" />
      <Typography variant="sm" weight={700} className="text-slate-600">
        {title}
      </Typography>
    </div>
  )
}
