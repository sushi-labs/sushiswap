import { Type } from '@sushiswap/currency'
import {
  classNames,
  DEFAULT_INPUT_CLASSNAME,
  DEFAULT_INPUT_UNSTYLED,
  ERROR_INPUT_CLASSNAME,
  Input,
  Typography,
} from '@sushiswap/ui'
import React, { FC, forwardRef } from 'react'

export type CurrencyInputBase = Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'onChange'> & {
  value: string | number
  onChange(value: string): void
  currency: Type | undefined
  className?: string
  inputClassName?: string
  error?: boolean
  bottomPanel?: JSX.Element
  helperTextPanel?: JSX.Element
  hideSymbol?: boolean
}

export const CurrencyInputBase: FC<CurrencyInputBase> = forwardRef<HTMLInputElement, CurrencyInputBase>(
  (
    {
      value,
      onChange,
      currency,
      className = '',
      inputClassName = '',
      error,
      bottomPanel,
      helperTextPanel,
      hideSymbol = false,
      ...rest
    },
    ref
  ) => {
    return (
      <>
        <div
          aria-hidden="true"
          className={classNames(
            className,
            DEFAULT_INPUT_CLASSNAME,
            error ? ERROR_INPUT_CLASSNAME : '',
            'relative flex flex-col justify-center'
          )}
        >
          <Input.Numeric
            variant="unstyled"
            ref={ref}
            value={value}
            type="text"
            placeholder="0.00"
            className={classNames(inputClassName, DEFAULT_INPUT_UNSTYLED, 'h-full', hideSymbol ? '' : '!pr-[60px]')}
            onUserInput={(val) => onChange(val)}
            {...rest}
          />
          {!hideSymbol && (
            <Typography
              variant="sm"
              weight={500}
              className="absolute right-4 top-3 bottom-0 text-slate-300 max-w-10 truncate"
            >
              {currency?.symbol}
            </Typography>
          )}
          {bottomPanel &&
            React.cloneElement(
              bottomPanel,
              {
                ...bottomPanel.props,
                onChange: bottomPanel.props.onChange ?? onChange,
              },
              bottomPanel.props.children
            )}
        </div>
        {helperTextPanel}
      </>
    )
  }
)
