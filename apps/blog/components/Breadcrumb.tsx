import { ChevronLeftIcon } from '@heroicons/react/solid'
import { LinkInternal } from '@sushiswap/ui'
import { Container } from '@sushiswap/ui/components/container'
import { FC } from 'react'

export const Breadcrumb: FC = () => {
  return (
    <Container maxWidth="5xl" className="mx-auto px-4 mt-4">
      <LinkInternal href="/" className="flex items-center gap-2 group">
        <ChevronLeftIcon width={24} className="text-slate-400 group-hover:text-slate-50" />
        <span className="text-sm font-medium cursor-pointer group-hover:text-slate-50 text-slate-400">Go Back</span>
      </LinkInternal>
    </Container>
  )
}
