import { Button, SkeletonText, classNames } from '@sushiswap/ui'
import { type FC, memo, useCallback } from 'react'
import { type EvmCurrency, EvmNative } from 'sushi/evm'

import { useIsMounted } from '@sushiswap/hooks'
import { Amount, Fraction } from 'sushi'
import type { CurrencyInputProps } from './CurrencyInput'

type PercentageInputs = Pick<
  CurrencyInputProps,
  'chainId' | 'onChange' | 'currency' | 'disableMaxButton' | 'loading'
> & {
  id?: string
  account: string | undefined
  balance: Amount<EvmCurrency> | null | undefined
}

const MIN_NATIVE_CURRENCY_FOR_GAS = 10n ** 16n // .01 ETH

const PERCENT_OPTIONS = [
  { label: '25%', value: new Fraction({ numerator: 1, denominator: 4 }) }, // Use Fraction to ensure correct division
  { label: '50%', value: new Fraction({ numerator: 1, denominator: 2 }) }, // Use Fraction to ensure correct division
  { label: 'MAX', value: new Fraction({ numerator: 1, denominator: 1 }) }, // Use Fraction to ensure correct division
]

export const PercentageInputs: FC<PercentageInputs> = memo(
  function BalancePanel({ id, balance, onChange, disableMaxButton, loading }) {
    const isMounted = useIsMounted()

    const onClick = useCallback(
      (value: Fraction) => {
        if (onChange && balance?.gt(0n)) {
          if (
            balance.currency.isNative &&
            balance.gt(MIN_NATIVE_CURRENCY_FOR_GAS)
          ) {
            const hundred = new Amount(
              EvmNative.fromChainId(balance.currency.chainId),
              MIN_NATIVE_CURRENCY_FOR_GAS,
            )
            const amount = balance.mul(value)

            const amountWithGas = amount.sub(hundred)

            if (amountWithGas?.gt(0n)) {
              onChange(amountWithGas.toString())
            } else {
              // If the amount after subtracting gas is not greater than 0, set to empty
              onChange('')
            }
          } else {
            const amount = balance.mul(value)

            onChange(amount?.gt(0n) ? amount.toString() : '')
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
            id={`${id}-percent-button${option.value.toString({ fixed: 1 })}`}
            testdata-id={`${id}-percent-button-${option.value.toString({ fixed: 1 })}`}
            type="button"
            variant="secondary"
            size="xs"
            onClick={() => onClick(option.value)}
            className={classNames(
              '!text-xs !font-medium !rounded-full text-slate-900 dark:text-slate-50 !min-h-[22px] !h-[22px] !bg-[#0000001F] dark:!bg-[#FFFFFF1F]',
            )}
            disabled={disableMaxButton}
            key={`${id}-percent-button${option.value.toString({ fixed: 1 })}`}
          >
            {option.label}
          </Button>
        ))}
      </div>
    )
  },
)
