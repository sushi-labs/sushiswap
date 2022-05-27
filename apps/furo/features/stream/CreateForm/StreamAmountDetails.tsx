import { CheckCircleIcon } from '@heroicons/react/solid'
import { Token } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { classNames, Dialog, Form, Select, Typography } from '@sushiswap/ui'
import { CurrencyInput } from 'components'
import { CreateStreamFormData } from 'features/stream/CreateForm/types'
import { TokenSelector } from 'features/TokenSelector'
import { useTokenBentoboxBalance, useTokens, useTokenWalletBalance } from 'hooks'
import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useAccount, useNetwork } from 'wagmi'

export const StreamAmountDetails = () => {
  const { data: account } = useAccount()
  const { activeChain } = useNetwork()
  const tokenMap = useTokens(activeChain?.id)

  const [dialogOpen, setDialogOpen] = useState(false)

  const { control, watch } = useFormContext<CreateStreamFormData>()
  // @ts-ignore
  const [token, fundSource] = watch(['token', 'fundSource'])

  const { data: walletBalance } = useTokenWalletBalance(account?.address, token)
  const { data: bentoBalance } = useTokenBentoboxBalance(account?.address, token)

  return (
    <Form.Section
      title="Stream Details"
      description="Furo allows for creating a vested stream using your Bentobox balance."
    >
      <Form.Control label="Token">
        <Controller
          control={control}
          name="token"
          render={({ field: { onChange, value }, fieldState: { error } }) => {
            return (
              <>
                <Select.Button
                  error={!!error?.message}
                  standalone
                  className="!cursor-pointer"
                  onClick={() => setDialogOpen(true)}
                >
                  {value?.symbol || <span className="text-slate-500">Select a token</span>}
                </Select.Button>
                <Form.Error message={error?.message} />
                <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                  <Dialog.Content className="!space-y-6 min-h-[600px] !max-w-md relative overflow-hidden border border-slate-700">
                    <TokenSelector
                      tokenMap={tokenMap}
                      onSelect={(token) => {
                        onChange(token)
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
      <Form.Control label="Change Funds Source">
        <Controller
          control={control}
          name="fundSource"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <div className="flex flex-col">
              <div className="flex gap-3 items-center">
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
                      {bentoBalance ? bentoBalance.toSignificant(6) : '0.00'}{' '}
                      <span className="text-slate-500">{bentoBalance?.currency.symbol}</span>
                    </Typography>
                  </div>
                  {value === FundSource.BENTOBOX && (
                    <div className="absolute top-3 right-3 w-5 h-5">
                      <CheckCircleIcon className="text-green/70" />
                    </div>
                  )}
                </div>
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
                      {walletBalance ? walletBalance.toSignificant(6) : '0.00'}{' '}
                      <span className="text-slate-500">{walletBalance?.currency.symbol}</span>
                    </Typography>
                  </div>
                  {value === FundSource.WALLET && (
                    <div className="absolute top-3 right-3 w-5 h-5">
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
            <>
              <CurrencyInput
                onChange={onChange}
                account={account?.address}
                value={value}
                token={token}
                fundSource={fundSource}
                errorMessage={error?.message}
                helperTextPanel={({ errorMessage }) => (
                  <CurrencyInput.HelperTextPanel
                    text={
                      !!errorMessage
                        ? errorMessage
                        : 'The total stream amount the recipient can withdraw when the stream passes its end date.'
                    }
                    isError={!!errorMessage}
                  />
                )}
              />
            </>
          )}
        />
      </Form.Control>
    </Form.Section>
  )
}
