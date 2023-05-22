import { Backdrop, Breadcrumb, classNames, Container, MaxWidth } from '@sushiswap/ui'
import React from 'react'

type Props = {
  children?: React.ReactNode
  maxWidth?: MaxWidth
  className?: string
}

export function Layout({ children, maxWidth = '5xl', className }: Props) {
  return (
    <Container maxWidth={maxWidth} className={classNames(className, 'lg:mx-auto px-4 h-full')}>
      <div className="pb-4 mt-10 mb-4 lg:mb-40 xl:mt-20">{children}</div>
    </Container>
  )
}
