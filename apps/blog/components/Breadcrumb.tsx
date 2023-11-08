import { ChevronLeftIcon } from '@heroicons/react/solid'
import { LinkInternal } from '@sushiswap/ui'
import { Container } from '@sushiswap/ui/components/container'
import type { FC } from 'react'

export const Breadcrumb: FC = () => {
  return (
    <Container className="mx-auto px-4 mt-4" maxWidth="5xl">
      <LinkInternal className="flex items-center gap-2 group" href="/">
        <ChevronLeftIcon
          className="text-slate-400 group-hover:text-slate-50"
          width={24}
        />
        <span className="text-sm font-medium cursor-pointer group-hover:text-slate-50 text-slate-400">
          Go Back
        </span>
      </LinkInternal>
    </Container>
  )
}
