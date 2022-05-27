import { AddressZero } from '@ethersproject/constants'
import { CheckCircleIcon } from '@heroicons/react/solid'
import { Amount, Token } from '@sushiswap/currency'
import furoExports from '@sushiswap/furo/exports.json'
import { JSBI, ZERO } from '@sushiswap/math'
import { Button, classNames, Dialog, Dots, Form, Typography } from '@sushiswap/ui'
import FUROSTREAM_ABI from 'abis/FuroStream.json'
import { createToast, CurrencyInput } from 'components'
import { BigNumber } from 'ethers'
import { parseUnits } from 'ethers/lib/utils'
import { Stream } from 'features/context/Stream'
import { FundSource, useFundSourceToggler } from 'hooks/useFundSourceToggler'
import { FC, useCallback, useState } from 'react'
import { useAccount, useContractWrite, useNetwork } from 'wagmi'

interface WithdrawModalProps {
  stream?: Stream
}

const WithdrawModal: FC<WithdrawModalProps> = ({ stream }) => {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string>()
  const [amount, setAmount] = useState<Amount<Token>>()
  const { value: fundSource, setValue: setFundSource } = useFundSourceToggler(FundSource.BENTOBOX)
  const { data: account } = useAccount()
  const { activeChain } = useNetwork()

  const { writeAsync, isLoading: isWritePending } = useContractWrite(
    {
      addressOrName: activeChain?.id
        ? (furoExports as any)[activeChain.id]?.[0].contracts.FuroStream.address
        : AddressZero,
      contractInterface: FUROSTREAM_ABI,
    },
    'withdrawFromStream',
    {
      onSuccess() {
        setOpen(false)
      },
    }
  )

  const withdraw = useCallback(async () => {
    if (!stream || !amount) return

    setError(undefined)

    try {
      const data = await writeAsync({
        args: [
          BigNumber.from(stream.id),
          BigNumber.from(amount.quotient.toString()),
          stream.recipient.id,
          fundSource === FundSource.BENTOBOX,
          '0x',
        ],
      })

      createToast({
        title: 'Withdraw from stream',
        description: `You have successfully withdrawn ${amount.toSignificant(6)} ${
          amount.currency.symbol
        } from your stream`,
        promise: data.wait(),
      })

      // Optimistic response (after 0 confirmation)
      data.wait(1).then(() => {
        if (stream && amount) {
          stream.withdrawnAmount = stream.withdrawnAmount.add(amount)
          stream.balance = stream.balance?.subtract(amount)
        }
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
        setAmount(Amount.fromRawAmount(stream.token, JSBI.BigInt(parseUnits(val, stream.token.decimals).toString())))
      }
    },
    [stream?.token]
  )

  return (
    <>
      <Button
        variant="filled"
        color="gradient"
        disabled={(account?.address && !stream?.canWithdraw(account.address)) || !stream?.balance?.greaterThan(ZERO)}
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
              token={stream?.token}
              onChange={onInput}
              value={amount?.toExact()}
              error={amount && stream?.balance && amount.greaterThan(stream.balance)}
              bottomPanel={<CurrencyInput.BottomPanel loading={false} label="Available" amount={stream?.balance} />}
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
export default WithdrawModal
