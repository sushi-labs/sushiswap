import { classNames, Container, MaxWidth } from '@sushiswap/ui'
import React from 'react'

type Props = {
  children?: React.ReactNode
  maxWidth?: MaxWidth
  backdrop?: React.ReactNode
  className?: string
}

export function Layout({ children, maxWidth = 'full', className }: Props) {
  return (
    <Container
      maxWidth={maxWidth}
      className={classNames(className, 'lg:mx-auto h-full')}
    >
      <div className='pb-4 mt-10 mb-4 lg:mb-40 xl:mt-20'>{children}</div>
    </Container>
  )
}
