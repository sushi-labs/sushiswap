'use client'

import { Button, type ButtonProps } from '@sushiswap/ui'
import { usePathname } from 'next/navigation'
import { forwardRef } from 'react'

interface PathnameButton extends Omit<ButtonProps, 'variant'> {
  pathname: string
  active?: boolean
}

export const PathnameButton = forwardRef<HTMLButtonElement, PathnameButton>(
  ({ pathname, active, ...props }, ref) => {
    const _pathname = usePathname()
    const isActive =
      active ??
      (_pathname === pathname || _pathname === pathname.replace('%3A', ':'))

    return (
      <Button {...props} ref={ref} variant={isActive ? 'secondary' : 'ghost'} />
    )
  },
)

PathnameButton.displayName = 'PathnameButton'
