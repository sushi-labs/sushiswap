import classNames from 'classnames'
import { FC } from 'react'

interface ToastButtons {
  href?: string
  onDismiss(): void
}

export const ToastButtons: FC<ToastButtons> = ({ href, onDismiss }) => {
  return (
    <div className={classNames(href ? 'grid-cols-2' : 'grid-cols-auto', 'grid divide-x divide-slate-200/5')}>
      {href && (
        <a
          href={href}
          target="_blank"
          className="text-xs font-semibold py-3 text-blue text-center hover:bg-slate-700/20 cursor-pointer border-t border-slate-200/5"
          rel="noreferrer"
        >
          View Detail
        </a>
      )}
      <button
        onClick={onDismiss}
        className="text-xs font-semibold py-3 text-blue text-center hover:bg-slate-700/20 cursor-pointer border-t border-slate-200/5"
      >
        Dismiss
      </button>
    </div>
  )
}
