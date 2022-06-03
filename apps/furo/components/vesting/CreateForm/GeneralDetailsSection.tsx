import { CheckCircleIcon } from '@heroicons/react/solid'
import { Token } from '@sushiswap/currency'
import { FundSource, useIsMounted } from '@sushiswap/hooks'
import { classNames, Dialog, Form, Input, Select, Typography } from '@sushiswap/ui'
import { Web3Input } from '@sushiswap/wagmi'
import { TokenSelector } from 'components'
import { useTokenBentoboxBalance, useWalletBalance } from 'lib/hooks'
import { useTokens } from 'lib/state/token-lists'
import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useAccount, useNetwork } from 'wagmi'

import { CreateVestingFormData } from './types'

export const GeneralDetailsSection = () => {
  const isMounted = useIsMounted()
  const { data: account } = useAccount()
  const [dialogOpen, setDialogOpen] = useState(false)
  const { control, watch, setValue } = useFormContext<CreateVestingFormData>()
  const { activeChain } = useNetwork()

  const tokenMap = useTokens(activeChain?.id)

  // @ts-ignore
  const currency = watch('currency')

  const { data: walletBalance } = useWalletBalance(account?.address, currency)
  const { data: bentoBalance } = useTokenBentoboxBalance(account?.address, currency?.wrapped)

  return (
    <Form.Section
      title="General Details"
      description="Furo allows for creating a vested stream using your Bentobox balance."
    >
      <Form.Control label="Token">
        <Controller
          control={control}
          name="currency"
          render={({ field: { onChange, value }, fieldState: { error } }) => {
            return (
              <>
                <Select.Button
                  error={!!error?.message}
                  standalone
                  className="!cursor-pointer"
                  onClick={() => setDialogOpen(true)}
                >
                  {value?.symbol || <span className="text-slate-500">Select a currency</span>}
                </Select.Button>
                <Form.Error message={error?.message} />
                <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                  <Dialog.Content className="!space-y-6 min-h-[600px] !max-w-md relative overflow-hidden border border-slate-700">
                    <TokenSelector
                      chainId={activeChain?.id}
                      tokenMap={tokenMap}
                      onSelect={(currency) => {
                        if (currency.isNative) {
                          setValue('fundSource', FundSource.WALLET)
                        }

                        onChange(currency)
                        setDialogOpen(false)
                      }}
                      currency={value as Token}
                      onClose={() => setDialogOpen(false)}
                    />
                  </Dialog.Content>
                </Dialog>
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
                <Input.DatetimeLocal onChange={onChange} value={value} error={!!error?.message} />
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
                value={value}
                onChange={onChange}
                error={!!error?.message}
                placeholder="Address or ENS Name"
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
    </Form.Section>
  )
}
