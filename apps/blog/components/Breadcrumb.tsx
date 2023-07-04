import { ChevronLeftIcon } from '@heroicons/react/solid'
import { Container } from '@sushiswap/ui/components/container'
import Link from 'next/link'
import { FC } from 'react'

export const Breadcrumb: FC = () => {
  return (
    <Container maxWidth="5xl" className="mx-auto px-4 mt-4">
      <Link href="/" passHref={true} legacyBehavior>
        <a className="flex items-center gap-2 group">
          <ChevronLeftIcon width={24} className="text-slate-400 group-hover:text-slate-50" />
          <span className="text-sm font-medium cursor-pointer group-hover:text-slate-50 text-slate-400">Go Back</span>
        </a>
      </Link>
    </Container>
  )
}
