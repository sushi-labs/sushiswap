import { classNames, ExtractProps } from '@sushiswap/ui'
import { Container, ContainerProps } from '@sushiswap/ui/components/container'
import React from 'react'

interface Props extends Pick<ExtractProps<ContainerProps>, 'maxWidth'> {
  children?: React.ReactNode
  backdrop?: React.ReactNode
  className?: string
}

export function Layout({ children, maxWidth = 'full', className }: Props) {
  return (
    <Container maxWidth={maxWidth} className={classNames(className, 'lg:mx-auto h-full')}>
      <div className="pb-4 mt-10 mb-4 lg:mb-40 xl:mt-20">{children}</div>
    </Container>
  )
}
