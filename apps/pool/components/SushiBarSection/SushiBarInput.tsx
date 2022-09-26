import { Amount, Type } from '@sushiswap/currency'
import { useIsMounted } from '@sushiswap/hooks'
import { Button, classNames, Currency, DEFAULT_INPUT_UNSTYLED, Input } from '@sushiswap/ui'
import { FC, useCallback } from 'react'

interface SushiBarInputProps {
  currency: Type
  balance: Amount<Type> | undefined
  value: string
  onChange(value: string): void
  disabled?: boolean
}

export const SushiBarInput: FC<SushiBarInputProps> = ({ currency, balance, onChange, value, disabled }) => {
  const isMounted = useIsMounted()
  const onMaxInput = useCallback(
    (amount?: Amount<Type>) => {
      onChange(amount ? amount.toExact() : '')
    },
    [onChange]
  )

  return (
    <div className="flex flex-col flex-grow gap-2">
      <div className="flex items-center w-full h-12 gap-2 px-4 shadow-md rounded-2xl bg-slate-700">
        <div className="min-w-[24px] min-height-[24px]">
          <Currency.Icon currency={currency} width={24} height={24} />
        </div>
        <p className="text-sm font-bold">{currency.symbol}</p>
        <Input.Numeric
          className={classNames(
            disabled ? 'pointer-events-none' : '',
            'flex flex-grow text-right font-semibold text-slate-50',
            DEFAULT_INPUT_UNSTYLED
          )}
          variant="unstyled"
          placeholder="0"
          onUserInput={onChange}
          value={value}
        />
      </div>
      {isMounted && (
        <div className="flex justify-between">
          <button
            onClick={() => onMaxInput(balance)}
            className={classNames(
              disabled ? 'pointer-events-none text-slate-400' : '',
              'px-2 text-xs cursor-pointer hover:text-slate-50'
            )}
          >
            Balance: {balance ? balance.toSignificant(6) : '0.000000'}
          </button>
          {!disabled && (
            <Button
              onClick={() => onMaxInput(balance)}
              className={classNames('!h-[unset]')}
              color="blue"
              variant="empty"
              size="xs"
            >
              Max
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
