import { Type } from '@sushiswap/currency'
import { classNames, ERROR_INPUT_CLASSNAME, Typography } from '@sushiswap/ui'
import React, { FC, useRef } from 'react'

export type CurrencyInputBase = {
  value: string | number | undefined
  onChange(value: string): void
  currency: Type | undefined
  className?: string
  error?: boolean
  bottomPanel?: JSX.Element
  helperTextPanel?: JSX.Element
}

export const CurrencyInputBase: FC<CurrencyInputBase> = ({
  value,
  onChange,
  currency,
  className = '',
  error,
  bottomPanel,
  helperTextPanel,
}) => {
  const amountInputRef = useRef<HTMLInputElement | null>(null)

  return (
    <>
      <div
        aria-hidden="true"
        onClick={() => amountInputRef.current?.focus()}
        className={classNames(
          className,
          error ? ERROR_INPUT_CLASSNAME : '',
          'flex flex-col rounded-xl bg-slate-800 focus:ring-1 focus-within:ring-1 ring-offset-2 ring-offset-slate-900 ring-blue'
        )}
      >
        <div className="flex items-center justify-between gap-1">
          <input
            ref={amountInputRef}
            value={value || ''}
            type="text"
            placeholder="0.00"
            className="px-4 text-left shadow-none border-none text-lg font-bold bg-transparent !ring-0 shadow-none"
            onChange={(e) => onChange(e.target.value)}
          />
          <Typography variant="sm" weight={700} className="pr-4 text-slate-500">
            {currency?.symbol}
          </Typography>
        </div>
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
