import classNames from 'classnames'
import React, { FC, forwardRef } from 'react'

import { DEFAULT_INPUT_CLASSNAME, ERROR_INPUT_CLASSNAME } from './index'

export type CounterProps = Omit<React.HTMLProps<HTMLInputElement> | 'ref' | 'as' | 'onChange'> & {
  step: number
  error: boolean
  value: number
  onChange(x: string): void
}

export const Counter: FC<CounterProps> = forwardRef(
  ({ value, onChange, className, step, error, min, max, ...rest }, ref) => {
    return (
      <div className="flex w-40">
        <div
          className={classNames(
            DEFAULT_INPUT_CLASSNAME,
            error ? ERROR_INPUT_CLASSNAME : '',
            'grid grid-cols-12 !p-0 bg-slate-800 h-[44px]',
            className,
          )}
        >
          <button
            className="col-span-3 text-2xl text-slate-500 hover:text-slate-400 hover:bg-slate-700 h-full w-10 rounded-l-xl cursor-pointer outline-none"
            type="button"
            onClick={() => onChange(Number(value || 0) - step)}
          >
            -
          </button>
          <input
            className={classNames(
              DEFAULT_INPUT_CLASSNAME,
              '!p-0 !border-none col-span-6 !rounded-none flex text-center focus:!ring-0 focus:!ring-offset-0 shadow-none w-unset',
            )}
            ref={ref}
            type="number"
            step={step}
            value={value || 0}
            onChange={(e) => onChange(e.target.value)}
            {...rest}
          />
          <button
            className="col-span-3 text-2xl text-slate-500 hover:text-slate-400 hover:bg-slate-700 h-full w-10 rounded-r-xl cursor-pointer outline-none"
            type="button"
            onClick={() => onChange(Number(value || 0) + step)}
          >
            +
          </button>
        </div>
      </div>
    )
  },
)
