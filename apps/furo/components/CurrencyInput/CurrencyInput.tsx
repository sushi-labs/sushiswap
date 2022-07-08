import { Amount, Currency, tryParseAmount } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { classNames, DEFAULT_INPUT_PADDING } from '@sushiswap/ui'
import { BottomPanel } from 'components/CurrencyInput/BottomPanel'
import { CurrencyInputBase } from 'components/CurrencyInput/CurrencyInputBase'
import { HelperTextPanel } from 'components/CurrencyInput/HelperTextPanel'
import { FC, useEffect, useMemo } from 'react'

import { useWalletBalance } from '../../lib'

type BottomPanelRenderProps = {
  onChange(value: string): void
  loading: boolean
  amount: Amount<Currency> | undefined
}

type HelperTextPanelRenderProps = {
  errorMessage: string | undefined
}

type CurrencyInput = Omit<CurrencyInputBase, 'bottomPanel' | 'error' | 'helperTextPanel'> & {
  onError?(message: string): void
  fundSource: FundSource | undefined
  account: string | undefined
  errorMessage?: string
  bottomPanel?:
    | React.ReactElement<typeof HelperTextPanel>
    | ((props: BottomPanelRenderProps) => React.ReactElement<typeof HelperTextPanel>)
  helperTextPanel?:
    | React.ReactElement<typeof HelperTextPanel>
    | ((props: HelperTextPanelRenderProps) => React.ReactElement<typeof HelperTextPanel>)
}

const Component: FC<CurrencyInput> = ({
  account,
  fundSource,
  value,
  currency,
  errorMessage: errorMessageProp,
  onChange,
  onError,
  helperTextPanel,
  bottomPanel,
  className,
  ...props
}) => {
  const { data: balance, isLoading: loading } = useWalletBalance(account, currency, fundSource)

  const insufficientBalanceError = useMemo(() => {
    const amountAsEntity = currency && value ? tryParseAmount(value.toString(), currency) : undefined
    return amountAsEntity && balance && amountAsEntity.greaterThan(balance) ? 'Insufficient Balance' : undefined
  }, [balance, currency, value])

  const errorMessage = errorMessageProp || insufficientBalanceError

  useEffect(() => {
    if (onError && insufficientBalanceError) onError(insufficientBalanceError)
  }, [onError, insufficientBalanceError])

  return (
    <CurrencyInput.Base
      {...props}
      className={classNames(className, DEFAULT_INPUT_PADDING)}
      inputClassName="pl-0 pt-0 pr-0 !pb-2"
      error={!!errorMessage}
      value={value}
      onChange={onChange}
      currency={currency}
      bottomPanel={
        bottomPanel ? (
          typeof bottomPanel === 'function' ? (
            bottomPanel({ onChange, loading, amount: balance })
          ) : (
            bottomPanel
          )
        ) : (
          <CurrencyInput.BottomPanel onChange={onChange} loading={loading} label="Balance" amount={balance} />
        )
      }
      helperTextPanel={
        helperTextPanel ? (
          typeof helperTextPanel === 'function' ? (
            helperTextPanel({ errorMessage })
          ) : (
            helperTextPanel
          )
        ) : errorMessage ? (
          <CurrencyInput.HelperTextPanel text={errorMessage} isError={true} />
        ) : (
          <></>
        )
      }
    />
  )
}

export const CurrencyInput: typeof Component & {
  Base: typeof CurrencyInputBase
  BottomPanel: typeof BottomPanel
  HelperTextPanel: typeof HelperTextPanel
} = Object.assign(Component, {
  Base: CurrencyInputBase,
  BottomPanel: BottomPanel,
  HelperTextPanel: HelperTextPanel,
})
