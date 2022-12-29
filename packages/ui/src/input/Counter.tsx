import classNames from 'classnames'
import React, { forwardRef } from 'react'

import { DEFAULT_INPUT_CLASSNAME, DEFAULT_INPUT_HOVER_BG, DEFAULT_INPUT_UNSTYLED, ERROR_INPUT_CLASSNAME } from './index'

export type CounterProps = Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'as' | 'onChange' | 'value'> & {
  step: number
  error: boolean
  value: number | undefined
  onChange(x: string): void
}

const matchNonNumbers = /\D+/g

export const Counter = forwardRef<HTMLInputElement, CounterProps>(
  ({ value, onChange, className, step, error, min, max, ...rest }, ref) => {
    return (
      <div className="flex w-40">
        <div
          className={classNames(
            DEFAULT_INPUT_CLASSNAME,
            error ? ERROR_INPUT_CLASSNAME : '',
            'grid grid-cols-12 !p-0 bg-slate-800 h-[44px]',
            className
          )}
        >
          <button
            className={classNames(
              DEFAULT_INPUT_HOVER_BG,
              'col-span-3 text-2xl text-slate-300 hover:text-slate-200 h-full w-10 rounded-l-xl cursor-pointer outline-none'
            )}
            type="button"
            onClick={() => onChange((Number(value || 0) - step).toString())}
          >
            -
          </button>
          <input
            className={classNames(DEFAULT_INPUT_UNSTYLED, 'col-span-6 !rounded-none flex text-center w-unset')}
            ref={ref}
            value={value || ''}
            onChange={(e) =>
              max
                ? onChange(
                    Math.min(
                      Number(e.target.value.replace(matchNonNumbers, '')),
                      Number(max ? max : e.target.value.replace(matchNonNumbers, ''))
                    ).toString()
                  )
                : undefined
            }
            {...rest}
          />
          <button
            className={classNames(
              DEFAULT_INPUT_HOVER_BG,
              'col-span-3 text-2xl text-slate-300 hover:text-slate-200 h-full w-10 rounded-r-xl cursor-pointer outline-none'
            )}
            type="button"
            onClick={() => onChange((Number(value || 0) + step).toString())}
          >
            +
          </button>
        </div>
      </div>
    )
  }
)
