import { Message, classNames } from '@sushiswap/ui'
import type { FC } from 'react'

type PriceImpactWarningProps =
  | {
      className?: string
      checked: boolean
      setChecked: (checked: boolean) => void
    }
  | {
      className?: string
      checked?: never
      setChecked?: never
    }

export const PriceImpactWarning: FC<PriceImpactWarningProps> = ({
  className,
  checked,
  setChecked,
}) => {
  return typeof setChecked === 'function' ? (
    <Message
      variant="destructive"
      size="sm"
      className={classNames('!p-4 cursor-pointer', className)}
    >
      <div className="flex items-center gap-2">
        <input
          id="expert-checkbox"
          type="checkbox"
          checked={checked as boolean}
          onChange={(e) =>
            (setChecked as (checked: boolean) => void)(e.target.checked)
          }
          className="cursor-pointer text-red-600 !ring-red-600 bg-white border-red rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2"
        />
        <label htmlFor="expert-checkbox" className="cursor-pointer select-none">
          Price impact is too high. You will lose a big portion of your funds in
          this transaction. Please tick the box if you would like to continue.
        </label>
      </div>
    </Message>
  ) : (
    <Message
      variant="destructive"
      size="sm"
      className={classNames('!p-4', className)}
    >
      Price impact is too high. You will lose a big portion of your funds in
      this transaction.
    </Message>
  )
}
