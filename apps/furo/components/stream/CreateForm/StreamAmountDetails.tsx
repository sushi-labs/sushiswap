import { ChainId } from '@sushiswap/chain'
import { FundSource } from '@sushiswap/hooks'
import { Form, Select } from '@sushiswap/ui'
import { TokenSelector } from '@sushiswap/wagmi'
import { CurrencyInput } from 'components'
import { useTokens } from 'lib/state/token-lists'
import { FC, useCallback, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useAccount } from 'wagmi'

import { useCustomTokens } from '../../../lib/state/storage'
import { useTokenFromZAmount, ZFundSourceToFundSource } from '../../../lib/zod'
import { FundSourceOption } from './FundSourceOption'
import { CreateStreamBaseSchemaType } from './schema'

export const StreamAmountDetails: FC<{ chainId: ChainId }> = ({ chainId }) => {
  const { address } = useAccount()
  const tokenMap = useTokens(chainId)
  const [customTokenMap, { addCustomToken, removeCustomToken }] = useCustomTokens(chainId)
  const [dialogOpen, setDialogOpen] = useState(false)

  const { control, watch, setValue, setError, clearErrors } = useFormContext<CreateStreamBaseSchemaType>()

  const [amount, fundSource] = watch(['amount', 'fundSource'])
  const currency = useTokenFromZAmount(amount)
  const _fundSource = ZFundSourceToFundSource.parse(fundSource)

  const onClose = useCallback(() => {
    setDialogOpen(false)
  }, [])

  const onSelect = useCallback(
    (onChange, currency) => {
      if (currency.isNative) {
        const { chainId, decimals, symbol, name, isNative } = currency
        onChange({ chainId, decimals, address: undefined, symbol, name, isNative })
        setValue('fundSource', FundSource.WALLET)
      } else {
        const { chainId, decimals, symbol, name, isNative, wrapped } = currency
        onChange({ chainId, decimals, address: wrapped.address, symbol, name, isNative })
      }

      onClose()
    },
    [onClose, setValue]
  )

  return (
    <Form.Section
      title="Stream Details"
      description="Furo allows you to create a stream from BentoBox to allow the recipient to gain yield whilst receiving the stream if the token that's being used has a BentoBox strategy set on it."
    >
      <Form.Control label="Token">
        <Controller
          control={control}
          name="amount.token"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <>
              <Select.Button
                error={!!error?.message}
                standalone
                className="!cursor-pointer ring-offset-slate-900"
                onClick={() => setDialogOpen(true)}
              >
                {value?.symbol || <span className="text-slate-500">Select a currency</span>}
              </Select.Button>
              <Form.Error message={error?.message} />
              <TokenSelector
                open={dialogOpen}
                variant="dialog"
                chainId={chainId}
                tokenMap={tokenMap}
                customTokenMap={customTokenMap}
                onSelect={(currency) => onSelect(onChange, currency)}
                currency={currency}
                onClose={onClose}
                onAddToken={addCustomToken}
                onRemoveToken={removeCustomToken}
              />
            </>
          )}
        />
      </Form.Control>
      <Form.Control label="Change Funds Source">
        <Controller
          control={control}
          name="fundSource"
          render={({ field: { onChange, value }, fieldState: { error } }) => {
            const _value = ZFundSourceToFundSource.parse(value)
            return (
              <div className="flex flex-col">
                <div className="flex items-center gap-3">
                  {!currency?.isNative && (
                    <FundSourceOption
                      chainId={chainId}
                      label="BentoBox"
                      active={_value === FundSource.BENTOBOX}
                      value={FundSource.BENTOBOX}
                      currency={currency}
                      onChange={() => onChange(FundSource.BENTOBOX)}
                    />
                  )}
                  <FundSourceOption
                    chainId={chainId}
                    label="Wallet"
                    active={_value === FundSource.WALLET}
                    value={FundSource.WALLET}
                    currency={currency}
                    onChange={() => onChange(FundSource.WALLET)}
                  />
                </div>
                <Form.Error message={error?.message} />
              </div>
            )
          }}
        />
      </Form.Control>
      <Form.Control label="Stream Amount">
        <Controller
          control={control}
          name="amount.amount"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <CurrencyInput
              className="ring-offset-slate-900"
              onChange={onChange}
              account={address}
              value={value || ''}
              currency={currency}
              fundSource={_fundSource}
              errorMessage={error?.message}
              onError={(message) => {
                message ? setError('amount', { type: 'typeError', message }) : clearErrors('amount.amount')
              }}
            />
          )}
        />
      </Form.Control>
    </Form.Section>
  )
}
