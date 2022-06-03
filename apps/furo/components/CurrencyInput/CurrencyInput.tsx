import { Amount, Currency, tryParseAmount } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { BalanceController } from 'components'
import { BottomPanel } from 'components/CurrencyInput/BottomPanel'
import { CurrencyInputBase } from 'components/CurrencyInput/CurrencyInputBase'
import { HelperTextPanel } from 'components/CurrencyInput/HelperTextPanel'
import { FC, useEffect, useState } from 'react'

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
  ...props
}) => {
  const [error, setError] = useState<string>()

  useEffect(() => {
    if (error && onError) onError(error)
  }, [error, onError])

  return (
    <BalanceController fundSource={fundSource} currency={currency} account={account}>
      {({ isLoading: loading, data: balance }) => {
        const amountAsEntity = currency && value ? tryParseAmount(value.toString(), currency) : undefined
        const insufficientBalanceError =
          amountAsEntity && balance && amountAsEntity.greaterThan(balance) ? 'Insufficient Balance' : undefined
        const errorMessage = errorMessageProp || insufficientBalanceError

        if (insufficientBalanceError) {
          setError(insufficientBalanceError)
        } else {
          setError(undefined)
        }

        return (
          <CurrencyInput.Base
            {...props}
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
      }}
    </BalanceController>
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
