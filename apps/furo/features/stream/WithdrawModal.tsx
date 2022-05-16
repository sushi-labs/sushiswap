import { AddressZero } from '@ethersproject/constants'
import { ArrowSmDownIcon } from '@heroicons/react/outline'
import { Amount, Token } from '@sushiswap/currency'
import { JSBI } from '@sushiswap/math'
import { Button, Dialog, Dots, Typography } from '@sushiswap/ui'
import FUROSTREAM_ABI from 'abis/FuroStream.json'
import { createToast } from 'components'
import { BigNumber } from 'ethers'
import { parseUnits } from 'ethers/lib/utils'
import { Stream } from 'features/context/Stream'
import StreamProgress from 'features/stream/StreamProgress'
import { STREAM_ADDRESS, useStreamBalance } from 'hooks'
import { ChangeEvent, FC, useCallback, useRef, useState } from 'react'
import { useAccount, useContractWrite, useNetwork } from 'wagmi'

interface WithdrawModalProps {
  stream?: Stream
}

const WithdrawModal: FC<WithdrawModalProps> = ({ stream }) => {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState<Amount<Token>>()
  const inputRef = useRef<HTMLInputElement>(null)
  const balance = useStreamBalance(stream?.id, stream?.token)
  const { data: account } = useAccount()
  const { activeChain } = useNetwork()

  const { writeAsync, isLoading: isWritePending } = useContractWrite(
    {
      addressOrName: activeChain?.id ? STREAM_ADDRESS[activeChain.id] : AddressZero,
      contractInterface: FUROSTREAM_ABI,
    },
    'withdrawFromStream',
    {
      onSuccess() {
        setOpen(false)
      },
    },
  )

  const withdraw = useCallback(async () => {
    if (!stream || !amount) return
    const data = await writeAsync({
      args: [BigNumber.from(stream.id), BigNumber.from(amount.quotient.toString()), stream.recipient.id, false, '0x'],
    })

    createToast({
      title: 'Withdraw from stream',
      description: `You have successfully withdrawn ${amount.toSignificant(6)} ${
        amount.currency.symbol
      } from your stream`,
      promise: data.wait(),
    })

    setAmount(undefined)
  }, [amount, stream, writeAsync])

  const onInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (isNaN(+e.target.value) || +e.target.value <= 0 || !stream?.token) {
        setAmount(undefined)
      } else {
        setAmount(
          Amount.fromRawAmount(stream.token, JSBI.BigInt(parseUnits(e.target.value, stream.token.decimals).toString())),
        )
      }
    },
    [stream?.token],
  )

  return (
    <>
      <Button
        variant="filled"
        color="gradient"
        disabled={stream?.recipient.id.toLowerCase() !== account?.address?.toLowerCase()}
        onClick={() => {
          setOpen(true)
        }}
      >
        Withdraw
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Dialog.Content className="space-y-4 !max-w-sm">
          <Dialog.Header title="Withdraw" onClose={() => setOpen(false)} />
          <StreamProgress stream={stream} />
          <div className="flex justify-center !-mb-8 !mt-3 relative">
            <div className="p-1 bg-slate-800 border-[3px] border-slate-700 rounded-2xl">
              <ArrowSmDownIcon width={24} height={24} className="text-slate-200" />
            </div>
          </div>
          <div
            className="-ml-6 !-mb-6 -mr-6 p-6 pt-8 bg-slate-800 border-t rounded-2xl border-slate-700 flex flex-col gap-1"
            onClick={() => inputRef.current?.focus()}
          >
            <div className="flex justify-between gap-3">
              <Typography variant="sm" weight={400}>
                Available
              </Typography>
              <Typography
                weight={700}
                variant="sm"
                className="text-slate-200"
                onClick={() => {
                  if (stream?.token) setAmount(balance)
                }}
              >
                {balance ? balance.toSignificant(6) : ''} {stream?.token.symbol}
              </Typography>
            </div>
            <div className="flex mb-3">
              <input
                value={amount?.toExact()}
                ref={inputRef}
                onChange={onInput}
                type="text"
                inputMode="decimal"
                title="Token Amount"
                autoComplete="off"
                autoCorrect="off"
                placeholder="0.00"
                pattern="^[0-9]*[.,]?[0-9]*$"
                className="p-0 pb-1 !border-b border-t-0 border-l-0 border-r-0 border-slate-700 placeholder:text-slate-500 bg-transparent 0 text-2xl !ring-0 !outline-none font-bold w-full"
              />
            </div>
            <Button
              variant="filled"
              color="gradient"
              fullWidth
              disabled={
                isWritePending || !amount || !balance || !amount.greaterThan(0) || amount.greaterThan(balance)
              }
              onClick={withdraw}
            >
              {!amount?.greaterThan(0) ? (
                'Enter an amount'
              ) : !stream?.token ? (
                'Invalid stream token'
              ) : balance && amount.greaterThan(balance) ? (
                'Not enough balance'
              ) : isWritePending ? (
                <Dots>Confirm Withdraw</Dots>
              ) : (
                'Withdraw'
              )}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog>
    </>
  )
}
export default WithdrawModal
