import { Amount, Currency, tryParseAmount } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { classNames, DEFAULT_INPUT_PADDING } from '@sushiswap/ui'
import { _useBalance as useBalance } from '@sushiswap/wagmi'
import React, { FC, useEffect, useMemo } from 'react'

import { BottomPanel, CurrencyInputBase, HelperTextPanel } from '.'

type BottomPanelRenderProps = {
  onChange(value: string): void
  loading: boolean
  amount: Amount<Currency> | undefined
}

type HelperTextPanelRenderProps = {
  errorMessage: string | undefined
}

type CurrencyInput = Omit<CurrencyInputBase, 'bottomPanel' | 'error' | 'helperTextPanel' | 'onError'> & {
  onError?(message?: string): void
  fundSource: FundSource
  account: string | undefined
  errorMessage?: string
  bottomPanel?:
    | React.ReactElement<typeof HelperTextPanel>
    | ((props: BottomPanelRenderProps) => React.ReactElement<typeof HelperTextPanel>)
  helperTextPanel?:
    | React.ReactElement<typeof HelperTextPanel>
    | ((props: HelperTextPanelRenderProps) => React.ReactElement<typeof HelperTextPanel>)
}

export const CurrencyInput: FC<CurrencyInput> = ({
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
  hideSymbol,
  name,
  onBlur,
}) => {
  const { data: balance, isLoading: loading } = useBalance({
    account,
    currency,
    chainId: currency?.chainId,
    loadBentobox: true,
  })

  const insufficientBalanceError = useMemo(() => {
    const amountAsEntity = currency && value ? tryParseAmount(value.toString(), currency) : undefined
    return amountAsEntity && balance?.[fundSource] && amountAsEntity.greaterThan(balance[fundSource])
      ? 'Insufficient Balance'
      : undefined
  }, [balance, currency, fundSource, value])

  const errorMessage = errorMessageProp || insufficientBalanceError

  useEffect(() => {
    if (onError && insufficientBalanceError) onError(insufficientBalanceError)
    else if (onError && !insufficientBalanceError) onError(undefined)
  }, [onError, insufficientBalanceError])

  return useMemo(
    () => (
      <CurrencyInputBase
        name={name}
        onBlur={onBlur}
        hideSymbol={hideSymbol}
        className={classNames(className, DEFAULT_INPUT_PADDING)}
        inputClassName="pl-0 pt-0 pr-0 !pb-2"
        error={!!errorMessage}
        value={value}
        onChange={onChange}
        currency={currency}
        bottomPanel={
          bottomPanel ? (
            typeof bottomPanel === 'function' ? (
              bottomPanel({ onChange, loading, amount: balance?.[fundSource] })
            ) : (
              bottomPanel
            )
          ) : (
            <BottomPanel onChange={onChange} loading={loading} label="Balance" amount={balance?.[fundSource]} />
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
            <HelperTextPanel text={errorMessage} isError={true} />
          ) : (
            <></>
          )
        }
      />
    ),
    [
      balance,
      bottomPanel,
      className,
      currency,
      errorMessage,
      fundSource,
      helperTextPanel,
      loading,
      onChange,
      hideSymbol,
      value,
    ]
  )
}
