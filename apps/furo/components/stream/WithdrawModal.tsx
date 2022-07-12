import { BigNumber } from '@ethersproject/bignumber'
import { CheckCircleIcon } from '@heroicons/react/solid'
import { Chain } from '@sushiswap/chain'
import { tryParseAmount } from '@sushiswap/currency'
import { FundSource, useFundSourceToggler } from '@sushiswap/hooks'
import { ZERO } from '@sushiswap/math'
import { Button, classNames, createToast, DEFAULT_INPUT_BG, Dialog, Dots, Typography } from '@sushiswap/ui'
import { getFuroStreamContractConfig, Web3Input } from '@sushiswap/wagmi'
import { CurrencyInput } from 'components'
import { Stream } from 'lib'
import { useStreamBalance } from 'lib/hooks'
import { FC, useCallback, useMemo, useState } from 'react'
import { useAccount, useContractWrite, useNetwork } from 'wagmi'

interface WithdrawModalProps {
  stream?: Stream
}

export const WithdrawModal: FC<WithdrawModalProps> = ({ stream }) => {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string>()
  const [input, setInput] = useState<string>('')
  const { value: fundSource, setValue: setFundSource } = useFundSourceToggler(FundSource.WALLET)
  const [withdrawTo, setWithdrawTo] = useState<string>()
  const { address } = useAccount()
  const { chain: activeChain } = useNetwork()
  const balance = useStreamBalance(activeChain?.id, stream?.id, stream?.token)

  const amount = useMemo(() => {
    if (!stream?.token) return undefined
    return tryParseAmount(input, stream.token)
  }, [input, stream?.token])

  const { writeAsync, isLoading: isWritePending } = useContractWrite({
    ...getFuroStreamContractConfig(activeChain?.id),
    onSuccess() {
      setOpen(false)
    },
    functionName: 'withdrawFromStream',
  })

  const withdraw = useCallback(async () => {
    if (!stream || !amount || !activeChain?.id) return

    setError(undefined)

    try {
      const data = await writeAsync({
        args: [
          BigNumber.from(stream.id),
          BigNumber.from(amount.toShare(stream.rebase).quotient.toString()),
          withdrawTo ?? stream.recipient.id,
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
  }, [activeChain?.id, amount, fundSource, stream, writeAsync, withdrawTo])

  return (
    <>
      <Button
        fullWidth
        variant="filled"
        color="gradient"
        disabled={!address || !stream?.canWithdraw(address) || !balance?.greaterThan(ZERO)}
        onClick={() => {
          setOpen(true)
        }}
      >
        Withdraw
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Dialog.Content className="space-y-3 !max-w-xs">
          <Dialog.Header title="Withdraw" onClose={() => setOpen(false)} />
          <div className="flex flex-col gap-2">
            <CurrencyInput.Base
              inputClassName="pb-2"
              className="ring-offset-slate-800"
              currency={stream?.token}
              onChange={setInput}
              value={input}
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
          </div>
          <div className="flex flex-col">
            <Web3Input.Ens
              id="withdraw-stream-recipient"
              value={withdrawTo}
              onChange={setWithdrawTo}
              className="ring-offset-slate-800"
              placeholder="Recipient (optional)"
            />
          </div>
          <div className="grid items-center grid-cols-2 gap-3">
            <div
              onClick={() => setFundSource(FundSource.WALLET)}
              className={classNames(
                fundSource === FundSource.WALLET ? 'ring-green/70' : 'ring-transparent',
                DEFAULT_INPUT_BG,
                'ring-2 ring-offset-2 ring-offset-slate-800 rounded-xl px-5 py-3 cursor-pointer relative flex flex-col justify-center gap-3 min-w-[140px]'
              )}
            >
              <Typography weight={500} variant="sm" className="!leading-5 tracking-widest text-slate-200">
                Wallet
              </Typography>
              <Typography variant="xs" className="text-slate-400">
                Receive funds in your Wallet
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
                fundSource === FundSource.BENTOBOX ? 'ring-green/70' : 'ring-transparent',
                DEFAULT_INPUT_BG,
                'ring-2 ring-offset-2 ring-offset-slate-800 rounded-xl px-5 py-3 cursor-pointer relative flex flex-col justify-center gap-3 min-w-[140px]'
              )}
            >
              <Typography weight={500} variant="sm" className="!leading-5 tracking-widest text-slate-200">
                Bentobox
              </Typography>
              <Typography variant="xs" className="text-slate-400">
                Receive funds in your BentoBox
              </Typography>
              {fundSource === FundSource.BENTOBOX && (
                <div className="absolute w-5 h-5 top-3 right-3">
                  <CheckCircleIcon className="text-green/70" />
                </div>
              )}
            </div>
          </div>
          {error && (
            <Typography variant="xs" className="text-center text-red" weight={500}>
              {error}
            </Typography>
          )}
          <Dialog.Actions>
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
          </Dialog.Actions>
        </Dialog.Content>
      </Dialog>
    </>
  )
}
