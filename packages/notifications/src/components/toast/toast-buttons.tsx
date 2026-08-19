import { Button, LinkExternal, classNames } from '@sushiswap/ui'
import type { FC } from 'react'

interface ToastButtons {
  href?: string
  onDismiss(): void
  variant?: 'default' | 'perps'
}

export const ToastButtons: FC<ToastButtons> = ({
  href,
  onDismiss,
  variant = 'default',
}) => {
  return (
    <div
      className={classNames(
        href ? 'grid-cols-2' : 'grid-cols-auto',
        'grid gap-4 p-4 pt-0',
        variant === 'perps' ? 'bg-perps-background' : '',
      )}
    >
      <Button
        size="sm"
        onClick={onDismiss}
        variant={variant === 'default' ? 'secondary' : 'perps-secondary'}
      >
        Dismiss
      </Button>

      {href && (
        <Button
          asChild
          size="sm"
          variant={variant === 'default' ? 'secondary' : 'perps-secondary'}
        >
          <LinkExternal href={href}>Transaction</LinkExternal>
        </Button>
      )}
    </div>
  )
}
