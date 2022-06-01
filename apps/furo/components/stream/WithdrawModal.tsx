import { BigNumber } from '@ethersproject/bignumber'
import { CheckCircleIcon } from '@heroicons/react/solid'
import { Chain } from '@sushiswap/chain'
import { Amount, Token, tryParseAmount } from '@sushiswap/currency'
import { FundSource, useFundSourceToggler } from '@sushiswap/hooks'
import { ZERO } from '@sushiswap/math'
import { Button, classNames, createToast, Dialog, Dots, Form, Typography } from '@sushiswap/ui'
import { getFuroStreamContractConfig } from '@sushiswap/wagmi'
import { CurrencyInput } from 'components'
import { Stream } from 'lib'
import { useStreamBalance } from 'lib/hooks'
import { FC, useCallback, useState } from 'react'
import { useAccount, useContractWrite, useNetwork } from 'wagmi'

interface WithdrawModalProps {
  stream?: Stream
}

export const WithdrawModal: FC<WithdrawModalProps> = ({ stream }) => {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string>()
  const [amount, setAmount] = useState<Amount<Token>>()
  const { value: fundSource, setValue: setFundSource } = useFundSourceToggler(FundSource.WALLET)
  const { data: account } = useAccount()
  const { activeChain } = useNetwork()

  const balance = useStreamBalance(activeChain?.id, stream?.id, stream?.token)

  const { writeAsync, isLoading: isWritePending } = useContractWrite(
    getFuroStreamContractConfig(activeChain?.id),
    'withdrawFromStream',
    {
      onSuccess() {
        setOpen(false)
      },
    }
  )

  const withdraw = useCallback(async () => {
    if (!stream || !amount || !activeChain?.id) return

    setError(undefined)

    try {
      const data = await writeAsync({
        args: [
          BigNumber.from(stream.id),
          BigNumber.from(amount.toShare(stream.rebase).quotient.toString()),
          stream.recipient.id,
          fundSource === FundSource.BENTOBOX,
          '0x',
        ],
      })

      createToast({
        txHash: data.hash,
        href: Chain.from(activeChain.id).getTxUrl(data.hash),
        promise: data.wait(),
        summary: {
          pending: (
            <Dots>
              Withdrawing {amount.toSignificant(6)} {amount.currency.symbol}
            </Dots>
          ),
          completed: `Successfully withdrawn ${amount.toSignificant(6)} ${amount.currency.symbol}`,
          failed: 'Something went wrong withdrawing from stream',
        },
      })
    } catch (e: any) {
      setError(e.message)
    }
  }, [amount, fundSource, stream, writeAsync])

  const onInput = useCallback(
    (val: string) => {
      if (isNaN(Number(val)) || Number(val) <= 0 || !stream?.token) {
        setAmount(undefined)
      } else {
        setAmount(tryParseAmount(val, stream.token))
      }
    },
    [stream?.token]
  )

  return (
    <>
      <Button
        variant="filled"
        color="gradient"
        disabled={!account || !stream?.canWithdraw(account?.address) || !stream?.balance?.greaterThan(ZERO)}
        onClick={() => {
          setOpen(true)
        }}
      >
        Withdraw
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Dialog.Content className="space-y-6 !max-w-sm">
          <Dialog.Header title="Withdraw" onClose={() => setOpen(false)} />
          <Form.Control label="Amount to withdraw">
            <CurrencyInput.Base
              currency={stream?.token}
              onChange={onInput}
              value={amount?.toExact() || ''}
              error={amount && stream?.balance && amount.greaterThan(stream.balance)}
              bottomPanel={<CurrencyInput.BottomPanel loading={false} label="Available" amount={balance} />}
              helperTextPanel={
                amount && stream?.balance && amount.greaterThan(stream.balance) ? (
                  <CurrencyInput.HelperTextPanel isError={true} text="Not enough available" />
                ) : (
                  <></>
                )
              }
            />
          </Form.Control>
          <Form.Control label="Receive funds in">
            <div className="grid items-center grid-cols-2 gap-5">
              <div
                onClick={() => setFundSource(FundSource.WALLET)}
                className={classNames(
                  fundSource === FundSource.WALLET
                    ? 'border-green/70 ring-green/70'
                    : 'ring-transparent border-slate-700',
                  'ring-1 border bg-slate-800 rounded-2xl px-5 py-3 cursor-pointer relative flex flex-col justify-center gap-3 min-w-[140px]'
                )}
              >
                <Typography weight={700} variant="sm" className="!leading-5 tracking-widest text-slate-300">
                  Wallet
                </Typography>
                {fundSource === FundSource.WALLET && (
                  <div className="absolute w-5 h-5 top-3 right-3">
                    <CheckCircleIcon className="text-green/70" />
                  </div>
                )}
              </div>
              <div
                onClick={() => setFundSource(FundSource.BENTOBOX)}
                className={classNames(
                  fundSource === FundSource.BENTOBOX
                    ? 'border-green/70 ring-green/70'
                    : 'ring-transparent border-slate-700',
                  'ring-1 border bg-slate-800 rounded-2xl px-5 py-3 cursor-pointer relative flex flex-col justify-center gap-3 min-w-[140px]'
                )}
              >
                <Typography weight={700} variant="sm" className="!leading-5 tracking-widest text-slate-300">
                  Bentobox
                </Typography>
                {fundSource === FundSource.BENTOBOX && (
                  <div className="absolute w-5 h-5 top-3 right-3">
                    <CheckCircleIcon className="text-green/70" />
                  </div>
                )}
              </div>
            </div>
          </Form.Control>
          <Button
            variant="filled"
            color="gradient"
            fullWidth
            disabled={
              isWritePending ||
              !amount ||
              !stream?.balance ||
              !amount.greaterThan(0) ||
              amount.greaterThan(stream.balance)
            }
            onClick={withdraw}
          >
            {!amount?.greaterThan(0) ? (
              'Enter an amount'
            ) : !stream?.token ? (
              'Invalid stream token'
            ) : isWritePending ? (
              <Dots>Confirm Withdraw</Dots>
            ) : (
              'Withdraw'
            )}
          </Button>
          {error && (
            <Typography variant="xs" className="text-center text-red" weight={700}>
              {error}
            </Typography>
          )}
        </Dialog.Content>
      </Dialog>
    </>
  )
}
