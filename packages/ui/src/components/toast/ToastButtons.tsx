import classNames from 'classnames'
import { FC } from 'react'

import { Button } from '../button'

interface ToastButtons {
  href?: string
  onDismiss(): void
}

export const ToastButtons: FC<ToastButtons> = ({ href, onDismiss }) => {
  return (
    <div className={classNames(href ? 'grid-cols-2' : 'grid-cols-auto', 'grid gap-4 p-4 pt-0')}>
      <Button size="sm" onClick={onDismiss} variant="secondary">
        Dismiss
      </Button>

      {href && (
        <Button asChild size="sm" variant="secondary">
          <a href={href} rel="noopener noreferrer" target="_blank">
            Transaction
          </a>
        </Button>
      )}
    </div>
  )
}
