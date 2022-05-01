import { Glow, Container, Typography, classNames } from '@sushiswap/ui'
import React from 'react'

export type LayoutProps = {
  children?: React.ReactNode
  title?: string
  subtitle?: string
  className?: string
}

function Layout({ children, title, subtitle, className }: LayoutProps) {
  return (
    <Container maxWidth="7xl" className={classNames('h-full mt-40 lg:mx-auto', className)}>
      <Typography variant="h1" className="mb-4">
        {title ?? 'Sushi DAO'} {subtitle ? subtitle : null}
      </Typography>
      {children}
    </Container>
  )
}

export default Layout
