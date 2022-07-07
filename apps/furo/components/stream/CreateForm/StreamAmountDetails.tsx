import { CheckCircleIcon } from '@heroicons/react/solid'
import { FundSource, useIsMounted } from '@sushiswap/hooks'
import { classNames, Form, Select, Typography } from '@sushiswap/ui'
import { TokenSelector } from '@sushiswap/wagmi'
import { CurrencyInput } from 'components'
import { useTokenBentoboxBalance, useWalletBalance } from 'lib/hooks'
import { useTokens } from 'lib/state/token-lists'
import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useAccount, useNetwork } from 'wagmi'

import { useCustomTokens } from '../../../lib/state/storage'
import { CreateStreamFormData } from '../types'

export const StreamAmountDetails = () => {
  const isMounted = useIsMounted()
  const { address } = useAccount()
  const { chain: activeChain } = useNetwork()
  const tokenMap = useTokens(activeChain?.id)
  const [customTokenMap, { addCustomToken, removeCustomToken }] = useCustomTokens(activeChain?.id)

  const [dialogOpen, setDialogOpen] = useState(false)

  const { control, watch, setValue, setError } = useFormContext<CreateStreamFormData>()
  // @ts-ignore
  const [currency, fundSource] = watch(['currency', 'fundSource'])

  const { data: walletBalance } = useWalletBalance(address, currency)
  const { data: bentoBalance } = useTokenBentoboxBalance(address, currency?.wrapped)

  return (
    <Form.Section
      title="Stream Details"
      description="Furo allows you to create a stream from BentoBox to allow the recipient to gain yield whilst receiving the stream if the token that's being used has a BentoBox strategy set on it."
    >
      <Form.Control label="Token">
        <Controller
          control={control}
          name="currency"
          render={({ field: { onChange }, fieldState: { error } }) => {
            return (
              <>
                <Select.Button
                  error={!!error?.message}
                  standalone
                  className="!cursor-pointer"
                  onClick={() => setDialogOpen(true)}
                >
                  {currency?.symbol || <span className="text-slate-500">Select a currency</span>}
                </Select.Button>
                <Form.Error message={error?.message} />
                <TokenSelector
                  open={dialogOpen}
                  variant="dialog"
                  chainId={activeChain?.id}
                  tokenMap={tokenMap}
                  customTokenMap={customTokenMap}
                  onSelect={(currency) => {
                    if (currency.isNative) {
                      setValue('fundSource', FundSource.WALLET)
                    }

                    onChange(currency)
                    setDialogOpen(false)
                  }}
                  currency={currency}
                  onClose={() => setDialogOpen(false)}
                  onAddToken={({ address, chainId, name, symbol, decimals }) =>
                    addCustomToken({ address, name, chainId, symbol, decimals })
                  }
                  onRemoveToken={removeCustomToken}
                />
              </>
            )
          }}
        />
      </Form.Control>
      <Form.Control label="Change Funds Source">
        <Controller
          control={control}
          name="fundSource"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                {!currency?.isNative && (
                  <div
                    onClick={() => onChange(FundSource.BENTOBOX)}
                    className={classNames(
                      value === FundSource.BENTOBOX
                        ? 'border-green/70 ring-green/70'
                        : 'ring-transparent border-slate-700',
                      'ring-1 border bg-slate-800 rounded-2xl px-5 py-3 cursor-pointer relative flex flex-col justify-center gap-3 min-w-[140px]'
                    )}
                  >
                    <Typography weight={700} variant="sm" className="!leading-5 tracking-widest text-slate-300">
                      Bentobox
                    </Typography>
                    <div className="flex flex-col gap-1">
                      <Typography variant="xs">Available Balance</Typography>
                      <Typography weight={700} variant="xs" className="text-slate-200">
                        {isMounted ? (
                          <>
                            {bentoBalance ? bentoBalance.toSignificant(6) : '0.00'}{' '}
                            <span className="text-slate-500">{bentoBalance?.currency.symbol}</span>
                          </>
                        ) : (
                          <div className="h-4" />
                        )}
                      </Typography>
                    </div>
                    {value === FundSource.BENTOBOX && (
                      <div className="absolute w-5 h-5 top-3 right-3">
                        <CheckCircleIcon className="text-green/70" />
                      </div>
                    )}
                  </div>
                )}
                <div
                  onClick={() => onChange(FundSource.WALLET)}
                  className={classNames(
                    value === FundSource.WALLET ? 'border-green/70 ring-green/70' : 'ring-transparent border-slate-700',
                    'ring-1 border bg-slate-800 rounded-2xl px-5 py-3 cursor-pointer relative flex flex-col justify-center gap-3 min-w-[140px]'
                  )}
                >
                  <Typography weight={700} variant="sm" className="!leading-5 tracking-widest text-slate-300">
                    Wallet
                  </Typography>
                  <div className="flex flex-col gap-1">
                    <Typography variant="xs">Available Balance</Typography>
                    <Typography weight={700} variant="xs" className="text-slate-200">
                      {isMounted ? (
                        <>
                          {walletBalance ? walletBalance.toSignificant(6) : '0.00'}{' '}
                          <span className="text-slate-500">{walletBalance?.currency.symbol}</span>
                        </>
                      ) : (
                        <div className="h-4" />
                      )}
                    </Typography>
                  </div>
                  {value === FundSource.WALLET && (
                    <div className="absolute w-5 h-5 top-3 right-3">
                      <CheckCircleIcon className="text-green/70" />
                    </div>
                  )}
                </div>
              </div>
              <Form.Error message={error?.message} />
            </div>
          )}
        />
      </Form.Control>
      <Form.Control label="Stream Amount">
        <Controller
          control={control}
          name="amount"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <CurrencyInput
              onChange={onChange}
              account={address}
              value={value}
              currency={currency}
              fundSource={fundSource}
              onError={(message) => setError('amount', { type: 'typeError', message })}
              errorMessage={error?.message}
              helperTextPanel={({ errorMessage }) => (
                <CurrencyInput.HelperTextPanel
                  text={
                    errorMessage
                      ? errorMessage
                      : 'The total stream amount the recipient can withdraw when the stream passes its end date.'
                  }
                  isError={!!errorMessage}
                />
              )}
            />
          )}
        />
      </Form.Control>
    </Form.Section>
  )
}
