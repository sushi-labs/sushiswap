import { AddressZero } from '@ethersproject/constants'
import { Amount, Token } from '@sushiswap/currency'
import { JSBI } from '@sushiswap/math'
import { Button, Dialog, Dots, Typography } from '@sushiswap/ui'
import FUROSTREAM_ABI from 'abis/FuroStream.json'
import { createToast, CurrencyInput } from 'components'
import { BigNumber } from 'ethers'
import { parseUnits } from 'ethers/lib/utils'
import { Stream } from 'features/context/Stream'
import StreamProgress from 'features/stream/StreamProgress'
import { STREAM_ADDRESS, useStreamBalance } from 'hooks'
import { FC, useCallback, useState } from 'react'
import { useAccount, useContractWrite, useNetwork } from 'wagmi'

interface WithdrawModalProps {
  stream?: Stream
}

const WithdrawModal: FC<WithdrawModalProps> = ({ stream }) => {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string>()
  const [amount, setAmount] = useState<Amount<Token>>()
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
    }
  )

  const withdraw = useCallback(async () => {
    if (!stream || !amount) return

    setError(undefined)

    try {
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
    } catch (e: any) {
      setError(e.message)
    }

    setAmount(undefined)
  }, [amount, stream, writeAsync])

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
        disabled={account?.address && !stream?.canWithdraw(account.address)}
        onClick={() => {
          setOpen(true)
        }}
      >
        Withdraw
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Dialog.Content className="space-y-6 !max-w-sm">
          <Dialog.Header title="Withdraw" onClose={() => setOpen(false)} />
          <StreamProgress stream={stream} />
          <CurrencyInput
            onChange={onInput}
            amount={amount?.toExact()}
            balance={balance}
            balanceLabel="Available"
            className="w-full"
          />
          <Button
            variant="filled"
            color="gradient"
            fullWidth
            disabled={isWritePending || !amount || !balance || !amount.greaterThan(0) || amount.greaterThan(balance)}
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
