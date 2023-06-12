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
      <Button size="sm" onClick={onDismiss} variant="outlined" color="blue">
        Dismiss
      </Button>

      {href && (
        <Button size="sm" as="a" href={href} target="_blank" rel="noreferrer" variant="outlined" color="blue">
          Transaction
        </Button>
      )}
    </div>
  )
}
