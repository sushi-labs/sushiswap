import { Button, SkeletonText, classNames } from '@sushiswap/ui'
import { type FC, memo, useCallback } from 'react'
import { Amount, Native, type Type } from 'sushi/currency'

import { useIsMounted } from '@sushiswap/hooks'
import type { CurrencyInputProps } from './CurrencyInput'

type PercentageInputs = Pick<
  CurrencyInputProps,
  'chainId' | 'onChange' | 'currency' | 'disableMaxButton' | 'loading'
> & {
  id?: string
  account: string | undefined
  balance: Amount<Type> | null | undefined
}

const MIN_NATIVE_CURRENCY_FOR_GAS = 10n ** 16n // .01 ETH

const PERCENT_OPTIONS = [
  { label: '25%', value: '0.25' },
  { label: '50%', value: '0.5' },
  { label: 'MAX', value: '1' },
]

export const PercentageInputs: FC<PercentageInputs> = memo(
  function BalancePanel({ id, balance, onChange, disableMaxButton, loading }) {
    const isMounted = useIsMounted()

    const onClick = useCallback(
      (value: string) => {
        if (onChange && balance?.greaterThan(0)) {
          if (
            balance.currency.isNative &&
            balance.greaterThan(MIN_NATIVE_CURRENCY_FOR_GAS)
          ) {
            const hundred = Amount.fromRawAmount(
              Native.onChain(balance.currency.chainId),
              MIN_NATIVE_CURRENCY_FOR_GAS,
            )
            const amount = balance.multiply(value)
            onChange(amount.subtract(hundred).toFixed())
          } else {
            const amount = balance.multiply(value)
            onChange(amount?.greaterThan(0) ? amount.toFixed() : '')
          }
        }
      },
      [balance, onChange],
    )

    if (loading || !isMounted) {
      return (
        <div className="w-[30px] flex items-center">
          {Array(3)
            .fill(null)
            .map((_, idx) => (
              <SkeletonText
                fontSize="sm"
                className="w-full rounded-full"
                key={idx}
              />
            ))}
        </div>
      )
    }

    return (
      <div className="flex items-center gap-2">
        {PERCENT_OPTIONS.map((option) => (
          <Button
            id={`${id}-percent-button${option.value}`}
            testdata-id={`${id}-percent-button-${option.value}`}
            type="button"
            variant="secondary"
            size="xs"
            onClick={() => onClick(option.value)}
            className={classNames(
              '!text-xs !font-medium !rounded-full text-slate-900 dark:text-slate-50 !min-h-[22px] !h-[22px] !bg-[#0000001F] dark:!bg-[#FFFFFF1F]',
            )}
            disabled={disableMaxButton}
            key={`${id}-percent-button${option.value}`}
          >
            {option.label}
          </Button>
        ))}
      </div>
    )
  },
)
