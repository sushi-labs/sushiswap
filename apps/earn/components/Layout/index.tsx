import { Backdrop, Breadcrumb, BreadcrumbLink, classNames, Container, MaxWidth } from '@sushiswap/ui'
import React from 'react'
import Button from '@sushiswap/ui/future/components/button/Button'
import { IconButton } from '@sushiswap/ui/future/components/IconButton'
import { XIcon } from '@heroicons/react/solid'
import { ExploitInfo } from '../ExploitInfo'

type Props = {
  children?: React.ReactNode
  maxWidth?: MaxWidth
  className?: string
  breadcrumbs?: BreadcrumbLink[]
}

export function Layout({ children, maxWidth = '5xl', className, breadcrumbs }: Props) {
  return (
    <Container maxWidth={maxWidth} className={classNames(className, 'lg:mx-auto px-4 h-full')}>
      {breadcrumbs && <Breadcrumb home="/" links={breadcrumbs} />}
      <div className="pb-4 mt-10 mb-4 lg:mb-40 xl:mt-20">{children}</div>
    </Container>
  )
}
