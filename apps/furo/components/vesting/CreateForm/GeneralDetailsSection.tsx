import { CheckCircleIcon } from '@heroicons/react/solid'
import { FundSource, useIsMounted } from '@sushiswap/hooks'
import { classNames, DEFAULT_INPUT_BG, Form, Input, Select, Typography } from '@sushiswap/ui'
import { TokenSelector, useBalance, Web3Input } from '@sushiswap/wagmi'
import { useTokens } from 'lib/state/token-lists'
import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useAccount, useNetwork } from 'wagmi'

import { useCustomTokens } from '../../../lib/state/storage'
import { CreateVestingFormData } from '../types'

export const GeneralDetailsSection = () => {
  const isMounted = useIsMounted()
  const { address } = useAccount()
  const [dialogOpen, setDialogOpen] = useState(false)
  const { control, watch, setValue } = useFormContext<CreateVestingFormData>()
  const { chain: activeChain } = useNetwork()
  const tokenMap = useTokens(activeChain?.id)
  const [customTokenMap, { addCustomToken, removeCustomToken }] = useCustomTokens(activeChain?.id)

  // @ts-ignore
  const currency = watch('currency')

  const { data: balance } = useBalance({ account: address, chainId: activeChain?.id, currency })

  return (
    <Form.Section
      title="General Details"
      description="Furo allows for creating a vested stream using your Bentobox balance."
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
      <Form.Control label="Start date">
        <Controller
          control={control}
          name="startDate"
          render={({ field: { onChange, value }, fieldState: { error } }) => {
            return (
              <>
                <Input.DatetimeLocal
                  onChange={onChange}
                  value={value}
                  error={!!error?.message}
                  className="!ring-offset-slate-900"
                />
                <Form.Error message={error?.message} />
              </>
            )
          }}
        />
      </Form.Control>
      <Form.Control label="Recipient">
        <Controller
          control={control}
          name="recipient"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <>
              <Web3Input.Ens
                id="ensInput"
                value={value}
                onChange={onChange}
                error={!!error?.message}
                placeholder="Address or ENS Name"
                className="ring-offset-slate-900"
              />
              <Form.Error message={error?.message} />
            </>
          )}
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
                      value === FundSource.BENTOBOX ? 'ring-green/70' : 'ring-transparent',
                      DEFAULT_INPUT_BG,
                      'ring-2 ring-offset-2 ring-offset-slate-900 rounded-xl px-5 py-3 cursor-pointer relative flex flex-col justify-center gap-3 min-w-[140px]'
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
                            {balance?.[FundSource.BENTOBOX] ? balance[FundSource.BENTOBOX].toSignificant(6) : '0.00'}{' '}
                            <span className="text-slate-500">{balance?.[FundSource.BENTOBOX].currency.symbol}</span>
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
                    value === FundSource.WALLET ? 'ring-green/70' : 'ring-transparent',
                    DEFAULT_INPUT_BG,
                    'ring-2 ring-offset-2 ring-offset-slate-900 rounded-xl px-5 py-3 cursor-pointer relative flex flex-col justify-center gap-3 min-w-[140px]'
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
                          {balance?.[FundSource.WALLET] ? balance[FundSource.WALLET].toSignificant(6) : '0.00'}{' '}
                          <span className="text-slate-500">{balance?.[FundSource.WALLET].currency.symbol}</span>
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
    </Form.Section>
  )
}
