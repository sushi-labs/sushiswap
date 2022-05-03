import { Stream } from 'features/context/Stream'
import { STREAM_ADDRESS, useStreamBalance } from 'hooks/useFuroStreamContract'
import { Amount, Token } from '@sushiswap/currency'
import { BigNumber } from 'ethers'
import { JSBI } from '@sushiswap/math'
import { ChangeEvent, FC, useCallback, useEffect, useRef, useState } from 'react'
import { Dialog } from '@sushiswap/ui/dialog'
import { Typography } from '@sushiswap/ui'
import Button from '@sushiswap/ui/button/Button'
import { ZERO } from '@sushiswap/core-sdk'
import { parseUnits } from 'ethers/lib/utils'
import StreamProgress from 'features/stream/StreamProgress'
import { useAccount, useContractWrite, useNetwork, useWaitForTransaction } from 'wagmi'
import Dots from '@sushiswap/ui/dots/Dots'
import { AddressZero } from '@ethersproject/constants'
import FUROSTREAM_ABI from 'abis/FuroStream.json'
import { createToast } from 'components/Toast'

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

  const buttonText = !amount?.greaterThan(ZERO) ? (
    'Enter an amount'
  ) : !stream?.token ? (
    'Invalid stream token'
  ) : balance && amount.greaterThan(balance) ? (
    'Not enough balance'
  ) : isWritePending ? (
    <Dots>Confirm Withdraw</Dots>
  ) : (
    'Withdraw'
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
          <div
            className="border border-blue/30 hover:border-blue/60 p-5 rounded-lg flex flex-col gap-3"
            onClick={() => inputRef.current?.focus()}
          >
            <div className="flex justify-between gap-3">
              <Typography variant="sm" weight={400}>
                Available to Withdraw:
              </Typography>
              <Typography
                weight={700}
                className="text-high-emphesis"
                onClick={() => {
                  if (stream?.token) setAmount(balance)
                }}
              >
                {balance ? balance.toSignificant(6) : ''} {stream?.token.symbol}
              </Typography>
            </div>
            <div className="flex">
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
                className="placeholder:text-secondary bg-transparent p-0 text-2xl !ring-0 !outline-none !border-none font-bold w-full"
              />
            </div>
          </div>
          <Button
            variant="filled"
            color="gradient"
            fullWidth
            disabled={isWritePending || !amount || !balance || !amount.greaterThan(ZERO) || amount.greaterThan(balance)}
            onClick={withdraw}
          >
            {buttonText}
          </Button>
        </Dialog.Content>
      </Dialog>
    </>
  )
}
export default WithdrawModal
