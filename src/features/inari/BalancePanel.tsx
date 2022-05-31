import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CurrencyAmount, Token } from '@sushiswap/core-sdk'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import Input from 'app/components/Input'
import Typography from 'app/components/Typography'
import { useAppDispatch } from 'app/state/hooks'
import { setValues } from 'app/state/inari/actions'
import { useDerivedInariState, useInariState, useSelectedInariStrategy } from 'app/state/inari/hooks'
import { Field } from 'app/state/inari/types'
import React, { FC, useCallback } from 'react'

interface BalancePanelProps {
  label: string
  token: Token
  value: string
  symbol: string
  balance: CurrencyAmount<Token> | null
  field: Field
  showMax?: boolean
}

const BalancePanel: FC<BalancePanelProps> = ({ label, value, token, showMax = false, symbol, balance, field }) => {
  const { i18n } = useLingui()
  const dispatch = useAppDispatch()
  const { zapIn } = useInariState()
  const { tokens } = useDerivedInariState()
  const { calculateOutputFromInput } = useSelectedInariStrategy()

  const dispatchValue = useCallback(
    async (val: string) => {
      dispatch(
        setValues({
          inputValue:
            field === Field.INPUT
              ? val
              : await calculateOutputFromInput(!zapIn, val, tokens.outputToken, tokens.inputToken),
          outputValue:
            field === Field.INPUT
              ? await calculateOutputFromInput(zapIn, val, tokens.inputToken, tokens.outputToken)
              : val,
        })
      )
    },
    [calculateOutputFromInput, dispatch, field, tokens.inputToken, tokens.outputToken, zapIn]
  )

  const onMax = useCallback(async () => {
    const val = balance ? balance?.toExact() : '0'
    await dispatchValue(val)
  }, [balance, dispatchValue])

  return (
    <div className="flex flex-col w-full gap-1">
      <div className="inline">
        <Typography component="span">{label}</Typography>{' '}
        <Typography component="span" weight={700}>
          {symbol}
        </Typography>
      </div>
      <div className="flex flex-row items-center gap-4 p-4 rounded bg-dark-800">
        <div className="overflow-hidden rounded-full">
          <CurrencyLogo currency={token} size={40} />
        </div>
        <Input.Numeric value={value} onUserInput={dispatchValue} />
        {showMax && (
          <span
            onClick={onMax}
            className="cursor-pointer flex items-center rounded-full h-[30px] bg-blue bg-opacity-30 hover:border-opacity-100 border border-blue border-opacity-50 text-xs font-medium text-blue px-3"
          >
            {i18n._(t`Max`)}
          </span>
        )}
      </div>
      <div className="flex flex-row">
        <div className="flex gap-2 cursor-pointer" onClick={onMax}>
          <Typography variant="sm" className="text-secondary">
            {i18n._(t`Balance:`)}
          </Typography>
          <Typography variant="sm">
            {balance?.toSignificant(6) || '0'} {symbol}
          </Typography>
        </div>
      </div>
    </div>
  )
}

export default BalancePanel
