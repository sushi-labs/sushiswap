import { Type } from '@sushiswap/currency'
import {
  classNames,
  DEFAULT_INPUT_CLASSNAME,
  DEFAULT_INPUT_UNSTYLED,
  ERROR_INPUT_CLASSNAME,
  Input,
  Typography,
} from '@sushiswap/ui'
import React, { FC, useRef } from 'react'

export type CurrencyInputBase = {
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

export const CurrencyInputBase: FC<CurrencyInputBase> = ({
  value,
  onChange,
  currency,
  className = '',
  inputClassName = '',
  error,
  bottomPanel,
  helperTextPanel,
  hideSymbol = false,
}) => {
  const amountInputRef = useRef<HTMLInputElement | null>(null)

  return (
    <>
      <div
        aria-hidden="true"
        onClick={() => amountInputRef.current?.focus()}
        className={classNames(
          className,
          DEFAULT_INPUT_CLASSNAME,
          error ? ERROR_INPUT_CLASSNAME : '',
          'relative flex flex-col justify-center'
        )}
      >
        <Input.Numeric
          variant="unstyled"
          ref={amountInputRef}
          value={value}
          type="text"
          placeholder="0.00"
          className={classNames(inputClassName, DEFAULT_INPUT_UNSTYLED, 'h-full', hideSymbol ? '' : '!pr-[60px]')}
          onUserInput={(val) => onChange(val)}
        />
        {!hideSymbol && (
          <Typography
            variant="sm"
            weight={700}
            className="absolute right-4 top-3 bottom-0 text-slate-500 max-w-10 truncate"
          >
            {currency?.symbol}
          </Typography>
        )}
        {bottomPanel &&
          React.cloneElement(
            bottomPanel,
            { ...bottomPanel.props, onChange: bottomPanel.props.onChange ?? onChange },
            bottomPanel.props.children
          )}
      </div>
      {helperTextPanel}
    </>
  )
}
