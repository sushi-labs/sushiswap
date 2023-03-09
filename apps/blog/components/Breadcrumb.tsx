import { ChevronLeftIcon } from '@heroicons/react/solid'
import { Container, Typography } from '@sushiswap/ui'
import Link from 'next/link'
import { FC } from 'react'

export const Breadcrumb: FC = () => {
  return (
    <Container maxWidth="5xl" className="mx-auto px-4 mt-4">
      <Link href="/" passHref={true} legacyBehavior>
        <a className="flex items-center gap-2 group">
          <ChevronLeftIcon width={24} className="text-slate-400 group-hover:text-slate-50" />
          <Typography variant="sm" weight={500} className="cursor-pointer group-hover:text-slate-50 text-slate-400">
            Go Back
          </Typography>
        </a>
      </Link>
    </Container>
  )
}
