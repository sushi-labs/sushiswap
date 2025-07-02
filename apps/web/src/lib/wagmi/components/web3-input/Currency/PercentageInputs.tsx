import { Button, SkeletonText, classNames } from '@sushiswap/ui'
import { type FC, memo, useCallback } from 'react'
import { Amount, Native, type Type } from 'sushi/currency'

import { useIsMounted } from '@sushiswap/hooks'
import { Fraction } from 'sushi/math'
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
  { label: '25%', value: new Fraction(1, 4) }, // Use Fraction to ensure correct division
  { label: '50%', value: new Fraction(1, 2) }, // Use Fraction to ensure correct division
  { label: 'MAX', value: new Fraction(1, 1) }, // Use Fraction to ensure correct division
]

export const PercentageInputs: FC<PercentageInputs> = memo(
  function BalancePanel({ id, balance, onChange, disableMaxButton, loading }) {
    const isMounted = useIsMounted()

    const onClick = useCallback(
      (value: Fraction) => {
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

            const amountWithGas = amount.subtract(hundred)

            if (amountWithGas?.greaterThan(0)) {
              onChange(amountWithGas.toFixed())
            } else {
              // If the amount after subtracting gas is not greater than 0, set to empty
              onChange('')
            }
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
        <div className="w-[130px] gap-2 flex items-center">
          {Array(3)
            .fill(null)
            .map((_, idx) => (
              <SkeletonText className="w-full rounded-full" key={idx} />
            ))}
        </div>
      )
    }

    return (
      <div className="flex items-center gap-2">
        {PERCENT_OPTIONS.map((option) => (
          <Button
            id={`${id}-percent-button${option.value.toFixed(1)}`}
            testdata-id={`${id}-percent-button-${option.value.toFixed(1)}`}
            type="button"
            variant="secondary"
            size="xs"
            onClick={() => onClick(option.value)}
            className={classNames(
              '!text-xs !font-medium !rounded-full text-slate-900 dark:text-slate-50 !min-h-[22px] !h-[22px] !bg-[#0000001F] dark:!bg-[#FFFFFF1F]',
            )}
            disabled={disableMaxButton}
            key={`${id}-percent-button${option.value.toFixed(1)}`}
          >
            {option.label}
          </Button>
        ))}
      </div>
    )
  },
)
